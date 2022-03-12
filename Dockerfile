FROM node:alpine AS builder
WORKDIR /app

COPY . .
RUN npm ci
RUN npm pack

####################
FROM node:alpine
WORKDIR /test

COPY --from=builder /app/dist /opt/yaml-scene
COPY --from=builder /app/entrypoint.sh /entrypoint.sh

ENV EXTENSIONS=

RUN chmod 777 /opt/yaml-scene/bin/cli.js
RUN chmod 777 /entrypoint.sh
RUN ln -s /opt/yaml-scene/bin/cli.js /usr/bin/yas
RUN ln -s /opt/yaml-scene/bin/cli.js /usr/bin/yaml-scene

RUN echo -e '- Echo: Welcome to yaml-scene container' > /test/index.yaml
RUN yas /test/index.yaml

ENTRYPOINT ["/entrypoint.sh"]
CMD ["/test/index.yaml", ""]