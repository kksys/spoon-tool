#!/usr/bin/env bash

USERNAME=${USERNAME:-"codespace"}

set -eux

if [ "$(id -u)" -ne 0 ]; then
  echo -e 'Script must be run as root. Use sudo, su, or add "USER root" to your Dockerfile before running this script.'
  exit 1
fi

# Ensure that login shells get the correct path if the user updated the PATH using ENV.
rm -f /etc/profile.d/00-restore-env.sh
echo "export PATH=${PATH//$(sh -lc 'echo $PATH')/\$PATH}" > /etc/profile.d/00-restore-env.sh
chmod +x /etc/profile.d/00-restore-env.sh

export DEBIAN_FRONTEND=noninteractive

sudo_if() {
  COMMAND="$*"
  if [ "$(id -u)" -eq 0 ] && [ "$USERNAME" != "root" ]; then
    su - "$USERNAME" -c "$COMMAND"
  else
    "$COMMAND"
  fi
}

if [ -e /usr/local/oryx ]; then
  # Enables the oryx tool to generate manifest-dir which is needed for running the postcreate tool
  DEBIAN_FLAVOR="focal-scm"
  mkdir -p /opt/oryx && echo "vso-focal" > /opt/oryx/.imagetype
  echo "DEBIAN|${DEBIAN_FLAVOR}" | tr '[a-z]' '[A-Z]' > /opt/oryx/.ostype

  # Oryx expects the tool to be installed at `/opt/oryx` and looks for relevant files in there.
  ln -snf /usr/local/oryx/* /opt/oryx
fi

# For the universal image, oryx build tool installs the detected platforms in /home/codespace/*. Hence, linking current platforms to the /home/codespace/ path and adding it to the PATH.
# This ensures that whatever platfornm versions oryx detects and installs are set as root.
NODE_PATH="/home/codespace/fnm/current"
if [ -e /usr/local/share/fnm ]; then
  ln -snf /usr/local/share/fnm /home/codespace
fi

PHP_PATH="/home/${USERNAME}/.php/current"
if [ -e /usr/local/php/current ]; then
  mkdir -p /home/${USERNAME}/.php
  ln -snf /usr/local/php/current $PHP_PATH
fi

PYTHON_PATH="/home/${USERNAME}/.python/current"
if [ -e /usr/local/python/current ]; then
  mkdir -p /home/${USERNAME}/.python
  ln -snf /usr/local/python/current $PYTHON_PATH
  ln -snf /usr/local/python /opt/python
fi

JAVA_PATH="/home/codespace/java/current"
if [ -e /usr/local/sdkman/candidates/java ]; then
  ln -snf /usr/local/sdkman/candidates/java /home/codespace
fi

RUBY_PATH="/home/${USERNAME}/.ruby/current"
if [ -e /usr/local/rvm/rubies/default ]; then
  mkdir -p /home/${USERNAME}/.ruby
  ln -snf /usr/local/rvm/rubies/default $RUBY_PATH
fi

DOTNET_PATH="/home/${USERNAME}/.dotnet"
if [ -e /usr/share/dotnet ]; then
  # Required due to https://github.com/devcontainers/features/pull/628/files#r1276659825
  chown -R "${USERNAME}:${USERNAME}" /usr/share/dotnet
  chmod g+r+w+s /usr/share/dotnet
  chmod -R g+r+w /usr/share/dotnet

  ln -snf /usr/share/dotnet $DOTNET_PATH
  mkdir -p /opt/dotnet/lts
  cp -R /usr/share/dotnet/dotnet /opt/dotnet/lts
  cp -R /usr/share/dotnet/LICENSE.txt /opt/dotnet/lts
  cp -R /usr/share/dotnet/ThirdPartyNotices.txt /opt/dotnet/lts
fi

MAVEN_PATH="/home/${USERNAME}/.maven/current"
mkdir -p /home/${USERNAME}/.maven
ln -snf /usr/local/sdkman/candidates/maven/current $MAVEN_PATH

HUGO_ROOT="/home/${USERNAME}/.hugo/current"
if [ -e /usr/local/hugo ]; then
  mkdir -p /home/${USERNAME}/.hugo
  ln -snf /usr/local/hugo $HUGO_ROOT
fi

HOME_DIR="/home/${USERNAME}/"
chown -R ${USERNAME}:${USERNAME} ${HOME_DIR}
chmod -R g+r+w "${HOME_DIR}"
find "${HOME_DIR}" -type d | xargs -n 1 chmod g+s

OPT_DIR="/opt/"
if [ $(getent group oryx) ]; then
  chown -R ${USERNAME}:oryx ${OPT_DIR}
  chmod -R g+r+w "${OPT_DIR}"
  find "${OPT_DIR}" -type d | xargs -n 1 chmod g+s
fi

append_secure_path() {
  SECURE_PATH=""
  if [ -e "${DOTNET_PATH}" ]; then
    SECURE_PATH+="${DOTNET_PATH}:"
  fi
  if [ -e "${NODE_PATH}/bin" ]; then
    SECURE_PATH+="${NODE_PATH}/bin:"
  fi
  if [ -e "${PHP_PATH}/bin" ]; then
    SECURE_PATH+="${PHP_PATH}/bin:"
  fi
  if [ -e "${PYTHON_PATH}/bin" ]; then
    SECURE_PATH+="${PYTHON_PATH}/bin:"
  fi
  if [ -e "${JAVA_PATH}/bin" ]; then
    SECURE_PATH+="${JAVA_PATH}/bin:"
  fi
  if [ -e "${RUBY_PATH}/binn" ]; then
    SECURE_PATH+="${RUBY_PATH}/bin:"
  fi
  SECURE_PATH+="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin:/usr/local/bin:/usr/local/share:/home/${USERNAME}/.local/bin:${PATH}"

  echo "Defaults secure_path=\"${SECURE_PATH}\"" >> /etc/sudoers.d/$USERNAME
}
append_secure_path

# # Temporary: Due to GHSA-c2qf-rxjj-qqgw
# bash -c ". /etc/profile.d/01-fnm-env.sh && fnm use --install-if-missing 18"
# bash -c "npm -g install -g npm@9.8.1"
# bash -c ". /etc/profile.d/01-fnm-env.sh && fnm install --lts && fnm use lts-latest"

echo "Done!"
