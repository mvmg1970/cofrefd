# Add the AL2023 public key to the kiwi build repository.
# Use the official HTTPS key so the isolated kiwi target does not depend on
# a host-side /etc/pki/rpm-gpg file that may not exist in Image Builder.
repo_file=$1
echo "gpgkey=https://cdn.amazonlinux.com/_assets/E951904AD832C631.asc" >> "${repo_file}"
