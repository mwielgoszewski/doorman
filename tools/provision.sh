#!/bin/bash
#
# doorman provisioning script
#
# Usage: provision.sh [-h|--help] [PARAMETER [ARGUMENT]] [PARAMETER [ARGUMENT]] ...
#
# Parameters:
#   -h, --help            Shows this help message and exit.
#   -m MODE, --mode MODE  Mode of operation. Default value is dev
#   -c TYPE, --cert TYPE  Type of certificate to use. Default value is self
#
# Arguments for MODE:
#   dev    Provision will run in development mode. Certificate will be self-signed.
#   prod   Provision will run in production mode.
#
# Arguments for TYPE:
#   self   Provision will use a self-signed SSL certificate that will be generated.
#   own    Provision will use the SSL certificate provided by the user.
#   certbot Provision will generate a SSL certificate using letsencrypt/certbot. More info here: https://certbot.eff.org/
#
# Optional Parameters:
#   -k PATH, --keyfile PATH      Path to supplied SSL key file.
#   -C PATH, --certfile PATH     Path to supplied SSL certificate pem file.
#   -D DOMAIN, --domain DOMAIN   Domain for the SSL certificate to be generated using letsencrypt.
#   -e EMAIL, --email EMAIL      Domain for the SSL certificate to be generated using letsencrypt.
#   -s PATH, --code PATH         Path to doorman code.
#   -d PATH, --destination PATH  Destination path to place the doorman folder.
#   -b PATH, --database PATH     Destination path to doorman database.
#   -p PORT, --port PORT         Port to use with doorman database connection.
#   -u USER, --username USER     Username to use launching the doorman PostgreSQL.
#
# Examples:
#   Provision doorman in development mode:
#     provision.sh -m dev -s /home/foobar/doorman -d /var/doorman
#   Provision doorman in production mode using my own certificate:
#     provision.sh -m prod -c own -k /etc/certs/my.key -C /etc/certs/cert.crt -s /home/foobar/doorman -d /var/doorman

# We want the provision script to fail as soon as there are any errors
set -e

# Default values
MODE="dev"
TYPE="self"
KEYFILE="none"
CERTFILE="none"
DOMAIN="none"
EMAIL="none"
POSTGRES_USER="postgres"
CODE_PATH="/vagrant"
DOORMAN_PATH="/opt/doorman"
DOORMAN_DB="/home/$POSTGRES_USER/doormandb"
POSTGRES_PORT=5432

# Arrays with valid arguments
VALID_MODE=("dev" "prod")
VALID_TYPE=("self" "own" "certbot")

function usage() {
  printf "\ndoorman provisioning script\n"
  printf "\nUsage: %s [-h|--help] [PARAMETER [ARGUMENT]] [PARAMETER [ARGUMENT]] ...\n" "${0}"
  printf "\nParameters:\n"
  printf "  -h, --help \t\tShows this help message and exit.\n"
  printf "  -m MODE, --mode MODE \tMode of operation. Default value is %s\n" "${MODE}"
  printf "  -c TYPE, --cert TYPE \tType of certificate to use. Default value is %s\n" "${TYPE}"
  printf "\nArguments for MODE:\n"
  printf "  dev \tProvision will run in development mode. Certificate will be self-signed.\n"
  printf "  prod \tProvision will run in production mode.\n"
  printf "\nArguments for TYPE:\n"
  printf "  self \tProvision will use a self-signed SSL certificate that will be generated.\n"
  printf "  own \tProvision will use the SSL certificate provided by the user.\n"
  printf "  cerbot Provision will generate a SSL certificate using letsencrypt/certbot. More info here: https://certbot.eff.org/\n"
  printf "\nOptional Parameters:\n"
  printf "  -k PATH, --keyfile PATH \tPath to supplied SSL key file.\n"
  printf "  -C PATH, --certfile PATH \tPath to supplied SSL certificate pem file.\n"
  printf "  -D DOMAIN, --domain DOMAIN \tDomain for the SSL certificate to be generated using letsencrypt.\n"
  printf "  -e EMAIL, --email EMAIL \tDomain for the SSL certificate to be generated using letsencrypt.\n"
  printf "  -s PATH, --code PATH \t\tPath to fbctf code. Default is %s\n" "${CODE_PATH}"
  printf "  -d PATH, --destination PATH \tDestination path to place the fbctf folder. Default is %s\n" "${DOORMAN_PATH}"
  printf "  -b PATH, --database PATH \tDestination path to doorman database. Default is %s\n" "${DOORMAN_DB}"
  printf "  -p PORT, --port PORT \tPort to use with doorman database connection. Default is %s\n" "${POSTGRES_PORT}"
  printf "  -u USER, --username USER \tUsername to use launching the doorman PostgreSQL. Default is %s\n" "${POSTGRES_USER}"
  printf "\nExamples:\n"
  printf "  Provision doorman in development mode:\n"
  printf "\t%s -m dev -s /home/foobar/doorman -d /var/doorman\n" "${0}"
  printf "  Provision doorman in production mode using my own certificate:\n"
  printf "\t%s -m prod -c own -k /etc/certs/my.key -C /etc/certs/cert.crt -s /home/foobar/doorman -d /var/doorman\n" "${0}"
}

ARGS=$(getopt -n "$0" -o hm:c:k:C:D:e:s:d:b:p:u: -l "help,mode:,cert:,keyfile:,certfile:,domain:,email:,code:,destination:,database:,port:,username:" -- "$@")

eval set -- "$ARGS"

while true; do
  case "$1" in
    -h|--help)
      usage
      exit 0
      ;;
    -m|-mode)
      GIVEN_ARG=$2
      if [[ "${VALID_MODE[@]}" =~ "${GIVEN_ARG}" ]]; then
        MODE=$2
        shift 2
      else
        usage
        exit 1
      fi
      ;;
    -c|--cert)
      GIVEN_ARG=$2
      if [[ "${VALID_TYPE[@]}" =~ "${GIVEN_ARG}" ]]; then
        TYPE=$2
        shift 2
      else
        usage
        exit 1
      fi
      ;;
    -k|--keyfile)
      KEYFILE=$2
      shift 2
      ;;
    -C|--certfile)
      CERTFILE=$2
      shift 2
      ;;
    -D|--domain)
      DOMAIN=$2
      shift 2
      ;;
    -e|--email)
      EMAIL=$2
      shift 2
      ;;
    -s|--code)
      CODE_PATH=$2
      shift 2
      ;;
    -d|--destination)
      DOORMAN_PATH=$2
      shift 2
      ;;
    -b|--database)
      DOORMAN_DB=$2
      shift 2
      ;;
    -p|--port)
      POSTGRES_PORT=$2
      shift 2
      ;;
    -u|--username)
      POSTGRES_USER=$2
      shift 2
      ;;
    --)
      shift
      break
      ;;
    *)
      usage
      exit 1
      ;;
  esac
done

# By default dev mode implies self-signed certificates
if [[ "$MODE" == "dev" ]]; then
  TYPE="self"
fi

echo "[+] Provisioning in $MODE mode"
echo "[+] Using $TYPE certificate"
echo "[+] Source code folder $CODE_PATH"
echo "[+] Destination folder $DOORMAN_PATH"


# Moving code to destination
sudo cp -R "$CODE_PATH" "$DOORMAN_PATH"

# Move to destination folder
cd "$DOORMAN_PATH"

# There we go!
source "tools/lib.sh"

# First things first, ascii art!
set_motd_ubuntu

# Adding osquery repo
repo_osquery

# Adding redis repo
log "Adding Redis repository"
sudo add-apt-repository ppa:chris-lea/redis-server -y

# Adding PostgreSQL 9.4 repo
repo_postgresql_ubuntu

# Execute apt-get update once
activate_repos

# Install osquery
log "Installing osquery"
package osquery

# Install redis
log "Installing redis"
package redis-server

# Installing PostgreSQL
log "Installing PostgreSQL"
package postgresql-9.4
package postgresql-server-dev-all

# Install python requirements
package python-pip
package python-dev
package libffi-dev
sudo pip install -r requirements/dev.txt

# Setting up PostgreSQL
setup_postgresql "$DOORMAN_DB" "$POSTGRES_PORT" "$POSTGRES_USER"
sudo su - "$POSTGRES_USER" -c "cd $DOORMAN_PATH; python manage.py db upgrade"

# Certificates
if [[ "$TYPE" == "self" ]]; then
  self_signed_cert "$DOORMAN_PATH"
fi
if [[ "$TYPE" == "own" ]]; then
  if [[ $CERTFILE == "none" ]]; then
    read -p ' -> Where is your certificate file? ' CERTFILE
  fi
  if [[ $KEYFILE == "none" ]]; then
    read -p ' -> Where is your private key file? ' KEYFILE
  fi
  own_cert "$CERTFILE" "$KEYFILE" "$DOORMAN_PATH"
fi
if [[ "$TYPE" == "certbot" ]]; then
  if [[ $EMAIL == "none" ]]; then
    read -p ' -> What is the email for the SSL Certificate recovery? ' EMAIL
  fi
  if [[ $DOMAIN == "none" ]]; then
    read -p ' -> What is the domain for the SSL Certificate? ' DOMAIN
  fi
  letsencrypt_cert "$EMAIL" "$DOMAIN" "$DOORMAN_PATH"
fi

# Javascript dependencies
package git
package nodejs
package nodejs-legacy
package npm
sudo npm install -g bower
sudo npm install -g less
sudo bower install --allow-root

# Celery workers
celery worker -A doorman.worker:celery -l INFO -f /tmp/celery.log &

# Kickoff doorman server
log "Kicking off doorman server"
sudo chown -R "$POSTGRES_USER"."$POSTGRES_USER" "$DOORMAN_PATH"
sudo su - "$POSTGRES_USER" -c "cd $DOORMAN_PATH; python manage.py ssl >> doorman.log 2>&1 &"

# Installing nginx to act as doorman proxy
package nginx
setup_nginx

# Kickoff osqueryd
log "Kicking off osqueryd"
sudo su -c "cd $DOORMAN_PATH; ENROLL_SECRET=secret osqueryd --flagfile tools/osquery.flags >> osquery.log 2>&1 &"

log "Provision finished, access doorman in http://10.11.22.33/manage"

exit 0
