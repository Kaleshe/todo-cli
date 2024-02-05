## TODO CLI

A simple node.js application to manage todos

## Setup

### Set up mongoDB database

Set global env variable
```
export MONGODB=<url>
```

### Install package and dependencies

```
npm i -g
```

## Commands

### Add a new todo item

```
todo new --description="Make lunch"
```

### Remove todo

```
todo delete --id="1234"
```

### Mark todo as complete

```
todo done --id="1234"
```

### List todo items

```
todo list
```

### List completed todo items

```
todo completed
```
