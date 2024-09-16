# Spoon Tool

You can see this page from [here](https://spoon-tool.kk-systems.net).

## How to build?

> [!TIP]
> You can run both frontend and backend with below instead of executing #4 and #5.
>
> 1. go to "Run and Debug" section on vscode
> 2. select "Launch frontend and backend" menu from pulldown menu
> 3. click "<img src=./.images/02-how-to-build-0001.png style="height: 20px;position: relative;top: 4px;" />" button

1.  clone this repository
2.  run below command on root directory of this repository to install dependencies
    ```bash
    $ pnpm i
    ```
3.  run below command on root directory of this repository to generate `.env` files to run this application on localhost
    ```bash
    $ ./build-scripts/generate-env.sh
    ```
4.  launch backend with below command on new terminal window
    ```bash
    $ pnpm -C packages/backend dev
    ```
5.  launch frontend with below command on new terminal window

    ```bash
    $ pnpm -C packages/frontend dev
    ```
