####################
FROM node:alpine
WORKDIR /test

ARG version

COPY ./entrypoint.sh /entrypoint.sh

ENV EXTENSIONS=

RUN yarn global add yaml-scene@$version
RUN chmod 777 /entrypoint.sh

RUN echo -e '- Echo: Welcome to yaml-scene container' > /test/index.yas.yaml
RUN yas /test/index.yas.yaml

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/test/index.yas.yaml", ""]