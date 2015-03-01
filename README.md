gideros [![Build Status](https://travis-ci.org/henrytao-me/gideros.svg?branch=master)](https://travis-ci.org/henrytao-me/gideros) [![Coverage Status](https://img.shields.io/coveralls/henrytao-me/gideros.svg)](https://coveralls.io/r/henrytao-me/gideros?branch=master)
===============

Gideros file system based - powered by nodejs


Usage
---------

## Installing

```
npm install -g gideros
```

## Using

Run this command in terminal:

```
gideros /path/to/your/gideros/project-name
```

## How does it work

Gideros Node server will watch all files in `project-name` directory then generate gideros configuration file `[project-name].gproj` (called compile process). The `compiler` will do the following tasks:

- Update `folder` and `file` by mapping with file system. 
- Detect and remove invalid `dependency`.
- Keep all other configurations like `properties`.

To prevent the `compiler` compile unwanted files, you can define `excludeRegex` and `includeRegex` in the file named `.gideros` at `/path/to/your/gideros/project-name/.gideros` using regular expression. 

These are all valid configuration for `.gideros` file which used in `MashballsClone` game:

```
{
	"includeRegex": false,
  "excludeRegex": [
  	"^\\.[^\\.]*", 
  	".gproj$", 
  	"LICENSE", 
  	"README.md", 
  	"^texturepacks/sources/", 
  	"^texturepacks/LevelScene/"]
}
```

```
{
	"includeRegex": false,
  "excludeRegex": "^\\.[^\\.]*|.gproj$|LICENSE|README.md|^texturepacks/sources/|^texturepacks/LevelScene/"
}
```

```
{
	"includeRegex": ".lua$",
  "excludeRegex": "^\\.[^\\.]*|.gproj$|LICENSE|README.md|^texturepacks/sources/|^texturepacks/LevelScene/"
}
```

```
{
	"includeRegex": [
		".lua$"
	],
  "excludeRegex": "^\\.[^\\.]*|.gproj$|LICENSE|README.md|^texturepacks/sources/|^texturepacks/LevelScene/"
}
```

**Note:** 

- If you define `includeRegex`, only matched directories are compiled. 
- `excludedRegex` has higher priority than `includeRegex`.


#### FINALLY, HAPPY CODING


License
-------------
MIT - Copyright (c) 2015 HenryTao.



