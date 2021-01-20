FROM node:14.15.4-buster

ENV USER node
ENV USER_ID 1000
ENV GROUP node

RUN mkdir -p /app && \
    chown -R ${USER}:${GROUP} /app

WORKDIR /app
COPY . /app
RUN npm install
RUN npm run build-dev

USER ${USER_ID}

EXPOSE 3000

CMD npm run start
