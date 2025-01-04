#!/bin/bash
#-------------------------------------------------------------------------------------------------------------------------
# Copyright (c) Microsoft Corporation. All rights reserved.
# Licensed under the MIT License. See https://github.com/devcontainers/features/blob/main/LICENSE for license information.
#-------------------------------------------------------------------------------------------------------------------------
#
# Docs: https://github.com/devcontainers/features/tree/main/src/node
# Maintainer: The Dev Container spec maintainers

export NODE_VERSION="${VERSION:-"lts"}"
export PNPM_VERSION="${PNPMVERSION:-"latest"}"
export FNM_VERSION="${FNMVERSION:-"latest"}"
export FNM_DIR="${FNMINSTALLPATH:-"/usr/local/share/fnm"}"
INSTALL_TOOLS_FOR_NODE_GYP="${NODEGYPDEPENDENCIES:-true}"
export INSTALL_YARN_USING_APT="${INSTALLYARNUSINGAPT:-true}"  # only concerns Debian-based systems

# Comma-separated list of node versions to be installed (with fnm)
# alongside NODE_VERSION, but not set as default.
ADDITIONAL_VERSIONS="${ADDITIONALVERSIONS:-""}"

USERNAME="${USERNAME:-"${_REMOTE_USER:-"automatic"}"}"
UPDATE_RC="${UPDATE_RC:-"true"}"

FNM_ENV_RC="/etc/profile.d/01-fnm-env.sh"
FNM_INSTALL_SCRIPT="/tmp/install_fnm.sh"

set -e

if [ "$(id -u)" -ne 0 ]; then
    echo -e 'Script must be run as root. Use sudo, su, or add "USER root" to your Dockerfile before running this script.'
    exit 1
fi

# Bring in ID, ID_LIKE, VERSION_ID, VERSION_CODENAME
. /etc/os-release
# Get an adjusted ID independent of distro variants
MAJOR_VERSION_ID=$(echo ${VERSION_ID} | cut -d . -f 1)
if [ "${ID}" = "debian" ] || [ "${ID_LIKE}" = "debian" ]; then
    ADJUSTED_ID="debian"
elif [[ "${ID}" = "rhel" || "${ID}" = "fedora" || "${ID}" = "mariner" || "${ID_LIKE}" = *"rhel"* || "${ID_LIKE}" = *"fedora"* || "${ID_LIKE}" = *"mariner"* ]]; then
    ADJUSTED_ID="rhel"
    if [[ "${ID}" = "rhel" ]] || [[ "${ID}" = *"alma"* ]] || [[ "${ID}" = *"rocky"* ]]; then
        VERSION_CODENAME="rhel${MAJOR_VERSION_ID}"
    else
        VERSION_CODENAME="${ID}${MAJOR_VERSION_ID}"
    fi
else
    echo "Linux distro ${ID} not supported."
    exit 1
fi

if [ "${ADJUSTED_ID}" = "rhel" ] && [ "${VERSION_CODENAME-}" = "centos7" ]; then
    # As of 1 July 2024, mirrorlist.centos.org no longer exists.
    # Update the repo files to reference vault.centos.org.
    sed -i s/mirror.centos.org/vault.centos.org/g /etc/yum.repos.d/*.repo
    sed -i s/^#.*baseurl=http/baseurl=http/g /etc/yum.repos.d/*.repo
    sed -i s/^mirrorlist=http/#mirrorlist=http/g /etc/yum.repos.d/*.repo
fi

# Setup INSTALL_CMD & PKG_MGR_CMD
if type apt-get > /dev/null 2>&1; then
    PKG_MGR_CMD=apt-get
    INSTALL_CMD="${PKG_MGR_CMD} -y install --no-install-recommends"
elif type microdnf > /dev/null 2>&1; then
    PKG_MGR_CMD=microdnf
    INSTALL_CMD="${PKG_MGR_CMD} -y install --refresh --best --nodocs --noplugins --setopt=install_weak_deps=0"
elif type dnf > /dev/null 2>&1; then
    PKG_MGR_CMD=dnf
    INSTALL_CMD="${PKG_MGR_CMD} -y install"
else
    PKG_MGR_CMD=yum
    INSTALL_CMD="${PKG_MGR_CMD} -y install"
fi

# Clean up
clean_up() {
    case ${ADJUSTED_ID} in
        debian)
            rm -rf /var/lib/apt/lists/*
            ;;
        rhel)
            rm -rf /var/cache/dnf/* /var/cache/yum/*
            rm -f /etc/yum.repos.d/yarn.repo
            ;;
    esac
}
clean_up

# Ensure that login shells get the correct path if the user updated the PATH using ENV.
rm -f /etc/profile.d/00-restore-env.sh
echo "export PATH=${PATH//$(sh -lc 'echo $PATH')/\$PATH}" > /etc/profile.d/00-restore-env.sh
chmod +x /etc/profile.d/00-restore-env.sh

updaterc() {
    local _bashrc
    local _zshrc
    if [ "${UPDATE_RC}" = "true" ]; then
        case $ADJUSTED_ID in
            debian)
                _bashrc=/etc/bash.bashrc
                _zshrc=/etc/zsh/zshrc
                ;;
            rhel)
                _bashrc=/etc/bashrc
                _zshrc=/etc/zshrc
            ;;
        esac
        echo "Updating ${_bashrc} and ${_zshrc}..."
        if [[ "$(cat ${_bashrc})" != *"$1"* ]]; then
            echo -e "$1" >> "${_bashrc}"
        fi
        if [ -f "${_zshrc}" ] && [[ "$(cat ${_zshrc})" != *"$1"* ]]; then
            echo -e "$1" >> "${_zshrc}"
        fi
    fi
}

install_fnm_env_rc() {
  echo -e "$1" > "${FNM_ENV_RC}"
}

install_fnm_script() {
  echo -e "$1" > "${FNM_INSTALL_SCRIPT}"
}

remove_fnm_script() {
  rm "${FNM_INSTALL_SCRIPT}"
}

pkg_mgr_update() {
    case $ADJUSTED_ID in
        debian)
            if [ "$(find /var/lib/apt/lists/* 2>/dev/null | wc -l)" = "0" ]; then
                echo "Running apt-get update..."
                ${PKG_MGR_CMD} update -y
            fi
            ;;
        rhel)
            if [ ${PKG_MGR_CMD} = "microdnf" ]; then
                if [ "$(ls /var/cache/yum/* 2>/dev/null | wc -l)" = 0 ]; then
                    echo "Running ${PKG_MGR_CMD} makecache ..."
                    ${PKG_MGR_CMD} makecache
                fi
            else
                if [ "$(ls /var/cache/${PKG_MGR_CMD}/* 2>/dev/null | wc -l)" = 0 ]; then
                    echo "Running ${PKG_MGR_CMD} check-update ..."
                    set +e
                        stderr_messages=$(${PKG_MGR_CMD} -q check-update 2>&1)
                        rc=$?
                        # centos 7 sometimes returns a status of 100 when it apears to work.
                        if [ $rc != 0 ] && [ $rc != 100 ]; then
                            echo "(Error) ${PKG_MGR_CMD} check-update produced the following error message(s):"
                            echo "${stderr_messages}"
                            exit 1
                        fi
                    set -e
                fi
            fi
            ;;
    esac
}

# Checks if packages are installed and installs them if not
check_packages() {
    case ${ADJUSTED_ID} in
        debian)
            if ! dpkg -s "$@" > /dev/null 2>&1; then
                pkg_mgr_update
                ${INSTALL_CMD} "$@"
            fi
            ;;
        rhel)
            if ! rpm -q "$@" > /dev/null 2>&1; then
                pkg_mgr_update
                ${INSTALL_CMD} "$@"
            fi
            ;;
    esac
}

# Figure out correct version of a three part version number is not passed
find_version_from_git_tags() {
    local variable_name=$1
    local requested_version=${!variable_name}
    if [ "${requested_version}" = "none" ]; then return; fi
    local repository=$2
    local prefix=${3:-"tags/v"}
    local separator=${4:-"."}
    local last_part_optional=${5:-"false"}
    if [ "$(echo "${requested_version}" | grep -o "." | wc -l)" != "2" ]; then
        local escaped_separator=${separator//./\\.}
        local last_part
        if [ "${last_part_optional}" = "true" ]; then
            last_part="(${escaped_separator}[0-9]+)?"
        else
            last_part="${escaped_separator}[0-9]+"
        fi
        local regex="${prefix}\\K[0-9]+${escaped_separator}[0-9]+${last_part}$"
        local version_list="$(git ls-remote --tags ${repository} | grep -oP "${regex}" | tr -d ' ' | tr "${separator}" "." | sort -rV)"
        if [ "${requested_version}" = "latest" ] || [ "${requested_version}" = "current" ] || [ "${requested_version}" = "lts" ]; then
            declare -g ${variable_name}="$(echo "${version_list}" | head -n 1)"
        else
            set +e
            declare -g ${variable_name}="$(echo "${version_list}" | grep -E -m 1 "^${requested_version//./\\.}([\\.\\s]|$)")"
            set -e
        fi
    fi
    if [ -z "${!variable_name}" ] || ! echo "${version_list}" | grep "^${!variable_name//./\\.}$" > /dev/null 2>&1; then
        echo -e "Invalid ${variable_name} value: ${requested_version}\nValid values:\n${version_list}" >&2
        exit 1
    fi
    echo "${variable_name}=${!variable_name}"
}

install_yarn() {
    if [ "${ADJUSTED_ID}" = "debian" ] && [ "${INSTALL_YARN_USING_APT}" = "true" ]; then
        # for backward compatiblity with existing devcontainer features, install yarn
        # via apt-get on Debian systems
        if ! type yarn >/dev/null 2>&1; then
            # Import key safely (new method rather than deprecated apt-key approach) and install
            curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | gpg --dearmor > /usr/share/keyrings/yarn-archive-keyring.gpg
            echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/yarn-archive-keyring.gpg] https://dl.yarnpkg.com/debian/ stable main" > /etc/apt/sources.list.d/yarn.list
            apt-get update
            apt-get -y install --no-install-recommends yarn
        else
            echo "Yarn is already installed."
        fi
    else
        local _ver=${1:-node}
        # on non-debian systems or if user opted not to use APT, prefer corepack
        # Fallback to npm based installation of yarn.
        # But try to leverage corepack if possible
        # From https://yarnpkg.com:
        # The preferred way to manage Yarn is by-project and through Corepack, a tool
        # shipped by default with Node.js. Modern releases of Yarn aren't meant to be
        # installed globally, or from npm.
        if ! bash -c ". '$FNM_ENV_RC' && fnm use ${_ver} && type yarn >/dev/null 2>&1"; then
            if bash -c ". '$FNM_ENV_RC' && fnm use ${_ver} && type corepack >/dev/null 2>&1"; then
                su ${USERNAME} -c "umask 0002 && . '$FNM_ENV_RC' && fnm use ${_ver} && corepack enable"
            fi
            if ! bash -c ". '$FNM_ENV_RC' && fnm use ${_ver} && type yarn >/dev/null 2>&1"; then
                # Yum/DNF want to install nodejs dependencies, we'll use NPM to install yarn
                su ${USERNAME} -c "umask 0002 && . '$FNM_ENV_RC' && fnm use ${_ver} && npm install --global yarn"
            fi
        else
            echo "Yarn already installed."
        fi
    fi
}

# Mariner does not have awk installed by default, this can cause
# problems is username is auto* and later when we try to install
# node via npm.
if ! type awk >/dev/null 2>&1; then
    check_packages awk
fi

# Determine the appropriate non-root user
if [ "${USERNAME}" = "auto" ] || [ "${USERNAME}" = "automatic" ]; then
    USERNAME=""
    POSSIBLE_USERS=("vscode" "node" "codespace" "$(awk -v val=1000 -F ":" '$3==val{print $1}' /etc/passwd)")
    for CURRENT_USER in "${POSSIBLE_USERS[@]}"; do
        if id -u ${CURRENT_USER} > /dev/null 2>&1; then
            USERNAME=${CURRENT_USER}
            break
        fi
    done
    if [ "${USERNAME}" = "" ]; then
        USERNAME=root
    fi
elif [ "${USERNAME}" = "none" ] || ! id -u ${USERNAME} > /dev/null 2>&1; then
    USERNAME=root
fi

# Ensure apt is in non-interactive to avoid prompts
export DEBIAN_FRONTEND=noninteractive

if ( [ -n "${VERSION_CODENAME}" ] && [[ "bionic" = *"${VERSION_CODENAME}"* ]] ) || [[ "rhel7" = *"${ADJUSTED_ID}${MAJOR_VERSION_ID}"* ]]; then
    node_major_version=$(echo "${NODE_VERSION}" | cut -d . -f 1)
    if [[ "${node_major_version}" -ge 18 ]] || [[ "${NODE_VERSION}" = "lts" ]] || [[ "${NODE_VERSION}" = "latest" ]]; then
        echo "(!) Unsupported distribution version '${VERSION_CODENAME}' for Node >= 18. Details: https://github.com/nodejs/node/issues/42351#issuecomment-1068424442"
        exit 1
    fi
fi

# Install dependencies
case ${ADJUSTED_ID} in
    debian)
        check_packages apt-transport-https curl ca-certificates tar gnupg2 dirmngr
        ;;
    rhel)
        check_packages ca-certificates tar gnupg2 which findutils util-linux tar
        # minimal RHEL installs may not include curl, or includes curl-minimal instead.
        # Install curl if the "curl" command is not present.
        if ! type curl > /dev/null 2>&1; then
            check_packages curl
        fi
        ;;
esac

if ! type git > /dev/null 2>&1; then
    check_packages git
fi

# Adjust node version if required
if [ "${NODE_VERSION}" = "none" ]; then
    export NODE_VERSION=
elif [ "${NODE_VERSION}" = "lts" ]; then
    export NODE_VERSION="lts/*"
elif [ "${NODE_VERSION}" = "latest" ]; then
    export NODE_VERSION="node"
fi

find_version_from_git_tags FNM_VERSION "https://github.com/Schniz/fnm"

# Install snipppet that we will run as the user
fnm_install_snippet="$(cat << EOF
set -e
umask 0002
# Do not update profile - we'll do this manually
export PROFILE=/dev/null
function install_fnm() {
  local VERSION_TAG=\$1

  curl -fsSL "https://raw.githubusercontent.com/Schniz/fnm/\${VERSION_TAG}/.ci/install.sh" | bash -s -- --install-dir "$FNM_DIR" --skip-shell 2>&1

  if [ \$? -ne 0 ]; then
    echo "Error: Failed to install fnm version \${VERSION_TAG}"
    exit 1
  fi
}
install_fnm "$([ "${FNM_VERSION}" != 'latest' ] && echo -n "v${FNM_VERSION}" || echo -n "latest")" || {
  PREV_FNM_VERSION=$(curl -s https://api.github.com/repos/Schniz/fnm/releases/latest | grep '"tag_name"' | sed -E 's/.*"([^"]+)".*/\1/')
  install_fnm "\${PREV_FNM_VERSION}"
  FNM_VERSION="\${PREV_FNM_VERSION}"
}
[ -s '$FNM_ENV_RC' ] && source '$FNM_ENV_RC'
if [ "${NODE_VERSION}" != "" ]; then
  fnm install "${NODE_VERSION}"
  fnm alias "${NODE_VERSION}" default
fi
EOF
)"

# Snippet that should be added into rc / profiles
fnm_env_rc_snippet="$(cat << EOF
# fnm
FNM_PATH='$FNM_DIR'
if [ -d "\$FNM_PATH" ]; then
  export PATH="\$FNM_PATH:\$PATH"
  eval "\`fnm env\`"
fi
EOF
)"

# Snippet that should be added into rc / profiles
fnm_rc_snippet="$(cat << EOF
[ -s '"'$FNM_ENV_RC'"' ] && source '"'$FNM_ENV_RC'"'
EOF
)"

# Create a symlink to the installed version for use in Dockerfile PATH statements
export FNM_SYMLINK_CURRENT=true

# Create fnm group to the user's UID or GID to change while still allowing access to fnm
if ! cat /etc/group | grep -e "^fnm:" > /dev/null 2>&1; then
    groupadd -r fnm
fi
usermod -a -G fnm ${USERNAME}

# Install fnm (which also installs NODE_VERSION), otherwise
# use fnm to install the specified node version. Always use
# umask 0002 so both the owner so that everything is u+rw,g+rw
umask 0002
if [ ! -d "${FNM_DIR}" ]; then
    # Create fnm dir, and set sticky bit
    mkdir -p "${FNM_DIR}"
    chown "${USERNAME}:fnm" "${FNM_DIR}"
    chmod g+rws "${FNM_DIR}"
    install_fnm_env_rc "${fnm_env_rc_snippet}"
    install_fnm_script "${fnm_install_snippet}"
    su ${USERNAME} "${FNM_INSTALL_SCRIPT}" 2>&1
    remove_fnm_script
    # Update rc files
    if [ "${UPDATE_RC}" = "true" ]; then
        updaterc "${fnm_rc_snippet}"
    fi
else
    echo "FNM already installed."
    if [ "${NODE_VERSION}" != "" ]; then
        su ${USERNAME} -c "umask 0002 && . '${FNM_ENV_RC}' && fnm install '${NODE_VERSION}' && fnm alias default '${NODE_VERSION}'"
    fi
fi

# Possibly install yarn (puts yarn in per-Node install on RHEL, uses system yarn on Debian)
install_yarn

# Additional node versions to be installed but not be set as
# default we can assume the fnm is the group owner of the fnm
# directory and the sticky bit on directories so any installed
# files will have will have the correct ownership (fnm)
if [ ! -z "${ADDITIONAL_VERSIONS}" ]; then
    OLDIFS=$IFS
    IFS=","
        read -a additional_versions <<< "$ADDITIONAL_VERSIONS"
        for ver in "${additional_versions[@]}"; do
            su ${USERNAME} -c "umask 0002 && . '${FNM_ENV_RC}' && fnm install '${ver}'"
            # possibly install yarn (puts yarn in per-Node install on RHEL, uses system yarn on Debian)
            install_yarn "${ver}"
        done

        # Ensure $NODE_VERSION is on the $PATH
        if [ "${NODE_VERSION}" != "" ]; then
                su ${USERNAME} -c "umask 0002 && . '${FNM_ENV_RC}' && fnm use default"
        fi
    IFS=$OLDIFS
fi

# Install pnpm
if [ ! -z "${PNPM_VERSION}" ] && [ "${PNPM_VERSION}" = "none" ]; then
    echo "Ignoring installation of PNPM"
else
    if bash -c ". '${FNM_ENV_RC}' && type npm >/dev/null 2>&1"; then
        (
            . "${FNM_ENV_RC}"
            [ ! -z "$http_proxy" ] && npm set proxy="$http_proxy"
            [ ! -z "$https_proxy" ] && npm set https-proxy="$https_proxy"
            [ ! -z "$no_proxy" ] && npm set noproxy="$no_proxy"
            npm install -g pnpm@$PNPM_VERSION --force
        )
    else
        echo "Skip installing pnpm because npm is missing"
    fi
fi

# If enabled, verify "python3", "make", "gcc", "g++" commands are available so node-gyp works - https://github.com/nodejs/node-gyp
if [ "${INSTALL_TOOLS_FOR_NODE_GYP}" = "true" ]; then
    echo "Verifying node-gyp OS requirements..."
    to_install=""
    if ! type make > /dev/null 2>&1; then
        to_install="${to_install} make"
    fi
    if ! type gcc > /dev/null 2>&1; then
        to_install="${to_install} gcc"
    fi
    if ! type g++ > /dev/null 2>&1; then
        if [ ${ADJUSTED_ID} = "debian" ]; then
            to_install="${to_install} g++"
        elif [ ${ADJUSTED_ID} = "rhel" ]; then
            to_install="${to_install} gcc-c++"
        fi
    fi
    if ! type python3 > /dev/null 2>&1; then
        if [ ${ADJUSTED_ID} = "debian" ]; then
            to_install="${to_install} python3-minimal"
        elif [ ${ADJUSTED_ID} = "rhel" ]; then
            to_install="${to_install} python3"
        fi
    fi
    if [ ! -z "${to_install}" ]; then
        pkg_mgr_update
        check_packages ${to_install}
    fi
fi


# Clean up
# su ${USERNAME} -c "umask 0002 && . '$FNM_ENV_RC' && fnm clear-cache"
clean_up

# Ensure privs are correct for installed node versions. Unfortunately the
# way fnm installs node versions pulls privs from the tar which does not
# have group write set. We need this when the gid/uid is updated.
mkdir -p "${FNM_DIR}/node-versions"
chmod -R g+rw "${FNM_DIR}/node-versions"

echo "Done!"
