FROM node AS builder
WORKDIR /app

COPY . .
RUN npm install
RUN npm run installmodule

####################
FROM alpine
WORKDIR /test

RUN apk add --update nodejs

COPY --from=builder /app/dist /opt/yaml-scene

RUN chmod 777 /opt/yaml-scene/bin/cli.js
RUN ln -s /opt/yaml-scene/bin/cli.js /usr/bin/yas
RUN ln -s /opt/yaml-scene/bin/cli.js /usr/bin/yaml-scene

RUN echo -e '- Echo: Welcome to yaml-scene container' > /test/index.yaml
RUN yas /test/index.yaml

CMD ["yas", "/test/index.yaml"]