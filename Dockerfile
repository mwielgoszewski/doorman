FROM alpine:3.6

WORKDIR /tmp
COPY ./requirements/prod.txt requirements.txt

# Install Python
RUN echo "http://dl-cdn.alpinelinux.org/alpine/edge/community" >> /etc/apk/repositories \
  && apk add --update --no-cache --virtual=build-dependencies \
              build-base \
              libffi-dev \
              musl \
              python-dev \
              postgresql-dev \
  && apk add --update \
              bash \
              git \
              nodejs \
              nodejs-npm \
              py2-pip \
              python \
              redis \
              runit \

  && pip install --upgrade pip \
  && npm install -g bower less \
  && pip install -r /tmp/requirements.txt \
  && pip install 'gunicorn==19.6.0' \

  # clean up
  && apk del --purge build-dependencies \
  && rm /var/cache/apk/* \
  && rm -rf /tmp/*

# Make some useful symlinks that are expected to exist
RUN cd /usr/bin \
  && ln -sf easy_install-2.7 easy_install \
  && ln -sf python2.7 python \
  && ln -sf python2.7-config python-config \
  && ln -sf pip2.7 pip

# Add our application to the container
COPY . /src/

# Create service directories to allow running services, along with the Doorman
# user/group.
RUN rm -rf /etc/service \
  && mv /src/docker/service /etc/ \
  && mv /src/docker/redis.conf /etc/ \
  && if [ ! -f /src/settings.cfg ]; then \
       mv /src/docker/default-settings.cfg /src/settings.cfg; \
     fi \
  && addgroup doorman \
  && adduser -G doorman -D doorman

# Install vendor libraries, pre-build static assets, and create default log
# file directory.
RUN cd /src/ \
  && bower install --allow-root \
  && python manage.py assets build \
  && mkdir /var/log/doorman/ \
  && chown doorman:doorman -R . \
  && chown doorman:doorman /var/log/doorman/

CMD ["runsvdir", "/etc/service"]
