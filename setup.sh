#!/bin/sh

_NODE_DIR=/usr/bin/node
_NPM_DIR=/usr/bin/npm
_NOT_SUDO=true

ask_for_sudo() {

    # Ask for the administrator password upfront
    sudo -v &> /dev/null

    _NOT_SUDO=false

    # Update existing `sudo` time stamp until this script has finished
    while true; do
        sudo -n true
        sleep 60
        kill -0 "$$" || exit
    done &> /dev/null &

}

download_and_install_node() {

    ask_for_sudo

    cd ~/Downloads
    rm -rf node-*
    wget https://nodejs.org/dist/v5.4.0/node-v5.4.0-linux-x64.tar.gz
    echo "Installing node..."
    cd /usr
    sudo tar --strip-components 1 -xzf ~/Downloads/node-v5.4.0-linux-x64.tar.gz
}

install_globals() {

    if $_NOT_SUDO; then
        ask_for_sudo
    fi


    command -v tsd >/dev/null 2>&1  || { echo >&2 "'tsd' is not installed globally. Will install it now..."; sudo npm install -g tsd; }
    command -v tsc >/dev/null 2>&1  || { echo >&2 "'typescript' is not installed globally. Will install it now..."; sudo npm install -g typescript; }
    command -v gulp >/dev/null 2>&1 || { echo >&2 "'gulp' is not installed globally. Will install it now..."; sudo npm install -g gulp; }
}

run_post_node_installation() {
    _node_ver=$(node -v)
    _npm_ver=$(npm -v)
    echo "Attempting to setup the environment with node version "$_node_ver" and npm version $_npm_ver"
    install_globals
}

if [ ! -f $_NODE_DIR  ] || [ ! -f $_NPM_DIR  ]; then
    echo "Node is not installed or setup properly. Attempting to install it now!"
    download_and_install_node
fi

run_post_node_installation
