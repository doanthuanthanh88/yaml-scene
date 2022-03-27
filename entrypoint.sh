#!/usr/bin/env sh

if [ -z "$EXTENSIONS" ]
then
  echo "No extensions to be installed";
else
  echo "Installing extensions...";

  list=$(echo $EXTENSIONS | tr " " "\n")
  for item in $list
  do
    echo "- $item";
  done

  yas add $EXTENSIONS;
fi

yas $1 $2
