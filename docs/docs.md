## Overview

Checkboxland is a JavaScript library for rendering things as HTML checkboxes, and embedding them in a webpage.

You can use it to display animations, text, and arbitrary data. Checkboxland is dependency-free, framework-agnostic, and kinda silly.

## Limitations

Having lots of elements on a webpage [can impact runtime performance](https://web.dev/dom-size/). Checkboxes are no exception. Checkboxland attempts to mitigate some of these issues, but you'll likely run into performance issues if you are displaying large grids (1500+ checkboxes), and trying to update them rapidly.

For best results, stay below 1500 checkboxes. Some good sizes in this range include `32x32`, `48x24`, and `64x16`;

## Setup

## An Example

## Low-level API

### getCheckboxValue

### setCheckboxValue

### getData

### setData

### clearData

## Extended API

### print

### marquee

### transitionWipe

### dataUtils

## Using Plugins

## Creating a Plugin
