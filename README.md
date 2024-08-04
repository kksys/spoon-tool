# Spoon Tool

You can see this page from [here](https://spoon-tool.kk-systems.net).

## How to build?

1. clone this repository
2. run below command on root directory of this repository to install dependencies
    ```bash
    $ pnpm i
    ```
3. run below command on root directory of this repository to generate `.env` files to run this application on localhost
    ```bash
    $ ./build-scripts/generate-env.sh
    ```
4. launch backend with below command on new terminal window
    ```bash
    $ pnpm -C packages/backend dev
    ```
5. launch frontend with below command on new terminal window
    ```bash
    $ pnpm -C packages/frontend dev
    ```
    <div style="border: 1px cyan solid; border-radius: 8px; padding: 8px;">
      <div style="font-size: 16px; font-weight: 900;padding-bottom: 16px;">💡Tips</div>

      <div>
        You can run both frontend and backend with below instead of executing #4 and #5.
        <br>
        <ol>
          <li>go to "Run and Debug" section on vscode</li>
          <li>select "Launch frontend and backend" menu from pulldown menu</li>
          <li>click "<span style="color: lightgreen;">▹</span>" button</li>
        </ol>
      </div>
    </div>
