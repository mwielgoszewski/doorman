#!/bin/bash

# doorman: Functions for provisioning scripts in Ubuntu/CentOS
#

function log() {
  echo "[+] - $1"
}

function error() {
  echo "[!] - $1"
  exit 1
}

function set_motd() {
  python -mplatform | grep -qi "Ubuntu" && set_motd_ubuntu || log "Not ready for CentOS"
}

function set_motd_ubuntu() {
  # If the cloudguest MOTD exists, disable it
  if [[ -f /etc/update-motd.d/51/cloudguest ]]; then
    sudo chmod -x /etc/update-motd.d/51-cloudguest
  fi
  sudo cp /vagrant/tools/motd-doorman.sh /etc/update-motd.d/10-help-text
}

function activate_repos() {
  python -mplatform | grep -qi "Ubuntu" && sudo apt-get update || log "No apt-get for CentOS"
}

function package() {
  python -mplatform | grep -qi "Ubuntu" && package_ubuntu $1 || package_centos $1
}

function package_ubuntu() {
  if [[ -n "$(dpkg --get-selections | grep -w "^$1$")" ]]; then
    log "$1 is already installed. skipping."
  else
    log "Installing $1"
    sudo DEBIAN_FRONTEND=noninteractive apt-get install $1 -y --no-install-recommends
  fi
}

function package_centos() {
  if [[ -n "$(rpm -qa | grep -w "^$1$")" ]]; then
    log "$1 is already installed. skipping."
  else
    log "Installing $1"
    sudo yum -y install $1
  fi
}

function repo_osquery() {
  python -mplatform | grep -qi "Ubuntu" && repo_osquery_ubuntu $1 || repo_osquery_centos $1
}

function repo_osquery_ubuntu() {
  log "Adding osquery repository keys"
  sudo apt-key adv --keyserver keyserver.ubuntu.com --recv-keys 1484120AC4E9F8A1A577AEEE97A80C63C9D8B80B
  log "Adding osquery repository"
  sudo add-apt-repository "deb [arch=amd64] https://osquery-packages.s3.amazonaws.com/trusty trusty main"
}

function repo_osquery_centos() {
  log "Adding osquery repository"
  sudo rpm -ivh https://osquery-packages.s3.amazonaws.com/centos7/noarch/osquery-s3-centos7-repo-1-0.0.noarch.rpm
}

function repo_postgresql_ubuntu() {
  log "Adding PostgreSQL repository keys"
  wget --quiet -O - https://postgresql.org/media/keys/ACCC4CF8.asc | sudo apt-key add -
  log "Adding PostgreSQL repository"
  sudo add-apt-repository "deb https://apt.postgresql.org/pub/repos/apt/ trusty-pgdg main" -y
}

function self_signed_cert() {
  local __dir=$1
  local __cert="$__dir/certificate.crt"
  local __key="$__dir/private.key"
  local __subj="/C=US/O=doorman/CN=localhost"

  log "Setting up server SSL certificates"
  sudo mkdir -p $__dir
  log "Generating doorman key: $__key"
  sudo openssl genrsa -out $__key 2048
  log "Generating doorman certificate: $__cert"
  sudo openssl req -x509 -new -nodes -key $__key -days 365 -out $__cert -subj $__subj
}

function own_cert() {
  local __cert=$1
  local __key=$2
  local __dir=$3

  log "Using own certificate ($__cert) and key ($__key)"
  sudo cp "$__cert" "$__dir/certificate.crt"
  sudo cp "$__key" "$__dir/private.key"
}

function letsencrypt_cert() {
  local __email=$1
  local __domain=$2
  local __dir=$3

  dl "https://dl.eff.org/certbot-auto" /usr/bin/certbot-auto
  sudo chmod a+x /usr/bin/certbot-auto
  /usr/bin/certbot-auto certonly -n --agree-tos --standalone --standalone-supported-challenges tls-sni-01 -m "$__email" -d "$__domain"
  sudo ln -s "/etc/letsencrypt/live/$__domain/cert.pem" "$__cert"
  sudo ln -s "/etc/letsencrypt/live/$__domain/privkey.pem" "$__key"
}

function setup_postgresql() {
  local __path=$1
  local __port=$2
  local __owner=$3

  log "PostgreSQL permissions"
  sudo cp tools/pg_hba.conf /etc/postgresql/9.4/main/pg_hba.conf
  sudo su - $__owner -c 'service postgresql restart'
  log "Setting up PostgreSQL in $__path, on port $__port"
  sudo mkdir -p $__path
  sudo chown $__owner.$__owner $__path
  sudo su - $__owner -c "/usr/lib/postgresql/9.4/bin/initdb $__path"
  sudo su - $__owner -c "/usr/lib/postgresql/9.4/bin/pg_ctl -D $__path -l $__path/pg.log -o -p$__port start"
  sudo su - $__owner -c "/usr/lib/postgresql/9.4/bin/createdb -h localhost -p $__port doorman"
}

function setup_nginx() {
  log "Setting up nginx as proxy"
  sudo cp /vagrant/tools/nginx.conf /etc/nginx/sites-available/default
  sudo service nginx restart
}
