# -*- mode: ruby -*-
# vi: set ft=ruby :

VAGRANTFILE_API_VERSION = "2"

Vagrant.configure(VAGRANTFILE_API_VERSION) do |config|
  config.vm.define :doorman_server do |doorman_server|
    doorman_server.vm.box = "ubuntu/trusty64"
    doorman_server.vm.hostname = "doorman"
    doorman_server.ssh.shell = "bash -c 'BASH_ENV=/etc/profile exec bash'"
    doorman_server.vm.provision "shell",
      path: "tools/provision.sh",
      preserve_order: true,
      privileged: false
    doorman_server.vm.network :private_network, ip: "10.11.22.33"
    doorman_server.vm.provider :virtualbox do |v|
      v.customize ["modifyvm", :id, "--natdnshostresolver1", "on"]
      v.customize ["modifyvm", :id, "--memory", 4096]
      v.customize ["modifyvm", :id, "--cpus", 2]
      v.customize ["modifyvm", :id, "--name", "doorman_server"]
    end
  end
end
