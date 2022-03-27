####################
FROM alpine
WORKDIR /test

ARG version
ENV EXTENSIONS=

RUN apk add --no-cache nodejs yarn npm

COPY ./entrypoint.sh /entrypoint.sh

RUN yarn global add yaml-scene@$version
RUN chmod 777 /entrypoint.sh

RUN echo -e '- Echo: Welcome to yaml-scene container' > /test/index.yas.yaml
RUN yas /test/index.yas.yaml

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/test/index.yas.yaml", ""]