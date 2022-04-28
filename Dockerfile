FROM node:14.18.1-alpine
ENV USER node
ENV USER_ID 1000
ENV GROUP node

RUN mkdir -p /app && \
    chown -R ${USER}:${GROUP} /app

WORKDIR /app
COPY . /app
RUN npm --loglevel warn ci
RUN npm run build-prod

USER ${USER_ID}

EXPOSE 3000

CMD npm run start
