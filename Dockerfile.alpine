####################
FROM node:alpine
WORKDIR /test

ARG version
ENV EXTENSIONS=

COPY ./entrypoint.sh /entrypoint.sh

RUN npm install -g yaml-scene@$version
RUN chmod 777 /entrypoint.sh

RUN echo -e '- Echo: Welcome to yaml-scene container' > /test/index.yas.yaml
RUN yas /test/index.yas.yaml

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/test/index.yas.yaml", ""]