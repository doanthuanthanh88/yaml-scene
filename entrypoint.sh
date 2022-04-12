#!/usr/bin/env sh

if [ "$1" = "sh" ]
then
  sh;
elif [ "$1" = "bash" ]
then
  bash;
else
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

    yarn global add $EXTENSIONS;
  fi

  yas $@;
fi