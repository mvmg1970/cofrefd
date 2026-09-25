# Enable the set-hostname-imds service. This will set the hostname
# based on IMDS in place of cloud-init

echo "enable set-hostname-imds.service" >> /usr/lib/systemd/system-preset/80-amzn-overrides.preset

systemctl preset set-hostname-imds

# Enable SSM only as a temporary, audited collection channel for T003.
# SSH, cloud-init and EC2 Instance Connect remain excluded by appliance.kiwi.
systemctl enable amazon-ssm-agent.service
