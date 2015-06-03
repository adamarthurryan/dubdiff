#!/bin/bash

# launch the mean docker container to execute a single command on the working directory
# the working directory will be mounted as /working in the docker container


# test if the data-docker-home container has been created
if docker inspect -f {{.Name}} data-docker-home > /dev/null
  then 
    echo > /dev/null
  else
    echo "* creating data-docker-home container"
    echo
    # The data container has a volume at /home/docker, is named 'data' and is based on busybox
    docker create -v /home/docker --name data-docker-home adamarthurryan/mean echo "Data container - docker home"
    
fi

docker run -it --rm --volumes-from=data-docker-home -v ${PWD}:/working -w /working adamarthurryan/mean bash default-packages.sh
