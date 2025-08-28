🔄 **This project has been modernized**. The dependencies and build system have been updated to work with modern Node.js versions (18+). While the original maintainer discontinued this project, it has been brought up to date with current tooling and security patches.

# Dashkiosk

![Build Status](https://github.com/vincentbernat/dashkiosk/workflows/Build/badge.svg)

Dashkiosk is a solution to manage dashboards on multiple screens. It
comes as four components:

 1. A _receiver_ runs in a browser attached to each screen and will
    display the requested dashboards. The receiver is quite dumb, it
    contacts the server and wait for it to tell which URL to display.

 2. A _server_ which will manage the screens by sending them what they
    should display. An administration interface allows the user to
    manage those screens individually or in a group.
    
 3. An _Android app_ that will run the receiver. This is mainly a
    fullscreen webview. There is also a _Firefox app_ fulfilling the
    same purpose.

 4. A _Chromecast custom receiver_ which will run the regular receiver
    if you want to display dashboards using Google Chromecast devices.

The full documentation is available on [ReadTheDocs][].

[ReadTheDocs]: https://dashkiosk.readthedocs.io

A live installation, reset every hour, is publicly available:
 - [administration panel](https://dashkiosk-demo.herokuapp.com/admin)
 - [receiver](http://dashkiosk-demo.herokuapp.com/receiver)

Here is a demonstration video:

[![Dashkiosk demo](https://img.youtube.com/vi/Vb4BvEzoYOU/0.jpg)](https://www.youtube.com/watch?v=Vb4BvEzoYOU "Dashkiosk demo")

# Development

## Requirements

- Node.js 18.0.0 or higher
- npm 9.0.0 or higher

## Setup

Install dependencies:

    $ npm install

Build the project:

    $ npm run postinstall
    # or directly:
    $ grunt dist

To run the server for development:

    $ grunt serve

## Recent Updates

This project has been updated with:

- **Node.js 22** support (minimum Node.js 18+)
- **Updated dependencies**: Express 4.21+, Socket.IO 4.8+, Winston 3.17+, Sequelize 6.37+
- **Modern build tools**: Updated Grunt configuration with latest plugins
- **Security patches**: Resolved critical vulnerabilities
- **GitHub Actions**: Updated CI/CD to test on Node.js 18, 20, and 22
- **Docker**: Updated to Node.js 22 with latest Debian base image

## Known Issues

Some tests may fail due to Sequelize v6 API changes. The core functionality builds and runs, but some legacy test patterns need updates for:
- Lodash v4 compatibility (`_.pluck` → `_.map`)
- Sequelize v6 API changes (`find` → `findOne`, `spread` → destructuring)
- Migration API updates

# Android receiver

The Android receiver has moved to its
[own repository](https://github.com/vincentbernat/dashkiosk-android).

# Chromecast receiver

The "official" Chromecast receiver has app ID `5E7A2C2C` and is hosted
in the `gh-pages` branch of this repository. To update it:

    $ grunt dist
    $ git worktree add ~/src/dashkiosk-gh-pages gh-pages
    $ cd ~/src/dashkiosk-gh-pages
    $ git rm -r *
    $ rsync -rv --include '*chromecast*' --include '*/' --exclude '*' ~-dashkiosk/dist/public/* .
    $ git add *
    $ git commit -m "Update"

# Docker

There is a `Dockerfile` to run *Dashkiosk* inside Docker. This will
also work with Chromecast devices if your Docker host supports the
`--net=host` option:

    $ docker run --net=host \
                 -v /var/lib/dashkiosk/database:/database \
                 -e "chromecast__enabled=1" \
                 -e "chromecast__receiver=http://<DOCKER_HOST_IP>:8081/receiver" \
                 -e "port=8081" \
                 ghcr.io/vincentbernat/dashkiosk:latest

To start without Chromecast support, simply run:

    $ docker run -d -p 8080:8080 \
                 -v /var/lib/dashkiosk/database:/database \
                 ghcr.io/vincentbernat/dashkiosk:latest

Using `latest` can be broken from time to time. You may prefer a
stable tag, like `2.8.0` or `2.8`.
