# Quire Starter Kit

This repository contains a starter Hugo site for use with the **Quire** project
(a suite of digital publishing tools from Getty Publications). Use this kit
to kick off development of a digital art catalogue or similar publication.

## What you need to get started
- **Hugo** static site generator
- **Node.js** (latest LTS version or newer) & npm (comes with Node automatically)
- **Git** (and optionally, a GitHub account)
- **Quire-cli** (coming soon), a command-line tool to make it easier to work
  with Quire projects
- A text editor ([Atom](https://atom.io/) is free and has many helpful features)

If you're using a Mac, we recommend that you use [homebrew](http://brew.sh) to
install Hugo and Node, and [GitHub Desktop](https://desktop.github.com/) if you
are unfamiliar with the `git` command-line interface.

In order to use this software, you'll also have to use a few simple commands in
your computer's terminal.

## About Hugo

Hugo is a static-site-generator written in Go. It's free and open-source. You'll
need to install it before you can use this kit (`brew install hugo` if you're
on a Mac and using Homebrew). For more information about installing or using
Hugo, visit [https://gohugo.io](https://gohugo.io/).

## Getting Started

The easiest way to get started is to download the **Quire-CLI** tool and use it
to create a new boilerplate project:

```
quire new my-project-name
```

## Usage

Run the server to preview (view your files at `localhost:1313`)
```
quire preview
```

Build the static site when ready (builds to `public/`)
```
quire build
```

(Optional) Deploy to Github Pages:
```
bin/deploy.sh
```

## Credits

## License
