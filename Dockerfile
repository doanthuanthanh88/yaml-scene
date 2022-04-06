####################
FROM alpine
WORKDIR /yaml-scene

ARG version

ENV NODE_ENV=production
ENV EXTENSIONS=

RUN apk add --no-cache nodejs 
RUN apk add --update yarn npm

RUN yarn global add yaml-scene@$version

RUN mkdir /test
RUN echo -e '- Echo: Welcome to yaml-scene container' > /test/index.yas.yaml
RUN yas /test/index.yas.yaml

ENTRYPOINT ["yas"]
CMD ["/test/index.yas.yaml", ""]