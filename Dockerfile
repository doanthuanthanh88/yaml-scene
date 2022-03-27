####################
FROM node:alpine
WORKDIR /test

ARG version
ENV EXTENSIONS=

COPY ./entrypoint.sh /entrypoint.sh

RUN ln -s "$(which node)" /usr/bin/node && \
    ln -s "$(which npm)" /usr/bin/npm

RUN yarn global add yaml-scene@$version
RUN chmod 777 /entrypoint.sh

RUN echo -e '- Echo: Welcome to yaml-scene container' > /test/index.yas.yaml
RUN yas /test/index.yas.yaml

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/test/index.yas.yaml", ""]