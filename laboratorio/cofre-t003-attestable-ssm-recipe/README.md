# AL2023 attestable-image

Kiwi recipe for Amazon Linux 2023 images with no operator access.

## AL2023 Attestable Image Configuration

This section explains the image description configurations included in this template to build an attestable AL2023 AMI. The configurations generate the UKI and set up an immutable file system with dm-verity and erofs to enable attestation.

### Image description is configured to generate the UKI

The image description uses the systemd bootloader to support booting from the UKI. The following is configured in the `<preferences>` element in the image description.

```xml
<bootloader name="systemd_boot" timeout="0"/>
```

The initrd is configured to allow dracut to create the UKI. The following is configured in the `<preferences>` element in the image description.

```xml
<initrd action="setup">
  <dracut uefi="true"/>
</initrd>
```

The image description installs the systemd-boot, binutils, and dracut packages as part of a chroot operation inside the image's root directory. The following are included in the `<packages type="image">` element in the image description.

```xml
<package name="systemd-boot"/>
<package name="binutils"/>
<package name="dracut"/>
```

### Image description is configured to use dm-verity

The image description creates a dm verity hash from all the blocks placed at the end of the root filesystem. The following property is configured in the `<type>` element.

```xml
verity_blocks="all"
```

The image description initiates a kernel panic if verity hash corruption is detected during runtime. If the hash is corrupted, the instance will fail to start. The following option is configured in the `<kernelcmdline>` property in the `<type>` element.

```xml
rd.kiwi.verity_options=panic-on-corruption
```

The image description installs the veritysetup and dracut-kiwi-verity packages as part of a chroot operation inside image's root directory. The following are included in the `<packages type="image">` element in the image description.

```xml
<package name="veritysetup"/>
<package name="dracut-kiwi-verity"/>
```

### Image description is configured to set up a read-only filesystem using erofs

The following properties are configured in the `<type>` element in the image description.

```xml
overlayroot="true"                        <!-- Enable the overlay filesystem -->
overlayroot_write_partition="false"       <!-- Disable persistent filesystem writes -->
overlayroot_readonly_filesystem="erofs"   <!-- Enable erofs -->
overlayroot_readonly_partsize="2048"      <!-- Specify the size of the read-only root filesystem -->
erofscompression="lz4hc,level=12">        <!-- Specify the erofs compression level -->
```

The image description installs the dracut-kiwi-overlay package as part of a chroot operation inside the image's root directory. The following is included in the `<packages type="image">` element in the image description.

```xml
<package name="dracut-kiwi-overlay"/>
```

### Image description is configured for no operator access

This image description removes operator access by explicitly ignoring packages that provide remote access capabilities. The following packages are excluded from the image:

- `openssh-server` - No SSH access
- `amazon-ssm-agent` - No Systems Manager access
- `cloud-init` and `cloud-init-cfg-ec2` - No cloud-init configuration
- `ec2-instance-connect` - No EC2 Instance Connect

These exclusions ensure that the resulting AMI has no built-in remote access mechanisms, providing a zero operator access environment.

### Automated UKI processing and trusted measurements generation

This image description includes an automated script (`edit_boot_install.sh`) that handles UKI extraction and trusted measurements generation during the build process. Users do not need to manually extract the UKI or generate measurements.

The script is automatically executed by KIWI NG during image creation and performs the following operations:

1. **Locates the UKI**: Finds the generated `kiwi.efi` file in the `/EFI/Linux/` directory
2. **Moves and renames the UKI**: Copies `kiwi.efi` to `/EFI/BOOT/` and renames it to the standard boot filename (e.g., `BOOTX64.EFI`)
3. **Cleans up directories**: Removes the temporary `/EFI/Linux/` and `/EFI/systemd/` directories
4. **Generates trusted measurements**: Automatically runs `nitro-tpm-pcr-compute` on the UKI to calculate PCR4 and PCR7 values
5. **Saves measurements**: Stores the PCR measurements in `pcr_measurements.json` in the build directory

The trusted measurements are automatically generated and saved in the following JSON format:

```json
{
  "Measurements": {
    "HashAlgorithm": "SHA384 { ... }",
    "PCR4": "PCR4_measurement",
    "PCR7": "PCR7_measurement"
  }
}
```

The measurements file is located at `<build-target-dir>/pcr_measurements.json` after the build completes.

### Build the raw disk image file from the image description

Build the image description using the KIWI NG system build command. The command creates a raw disk image file (.raw) in the ./image directory and automatically executes the UKI processing script.

```bash
sudo kiwi-ng \
  --color-output \
  --loglevel 0 \
  system build \
  --description ./kiwi-image-descriptions-examples/al2023/attestable-image-example \
  --target-dir ./image
```

## Testing KMS with TPM Attestation

To test KMS functionality with TPM attestation on your instance, run the following commands:

```bash
private_key="$(openssl genrsa | base64 --wrap 0)"
public_key="$(openssl rsa \
  -pubout \
  -in <(base64 --decode <<< "$private_key") \
  -outform DER \
  2> /dev/null \
  | base64 --wrap 0)"

attestation_doc="$(nitro-tpm-attest \
  --public-key <(base64 --decode <<< "$public_key") \
  | base64 --wrap 0)"

aws kms generate-random \
  --number-of-bytes 32 \
  --region "$REGION" \
  --recipient "KeyEncryptionAlgorithm=RSAES_OAEP_SHA_256,AttestationDocument=$attestation_doc"
```

For automated testing, create a systemd service to run these commands on boot.

### Verification

Verify the KMS calls with TPM attestation by checking CloudTrail:

```bash
aws cloudtrail lookup-events \
  --lookup-attributes AttributeKey=EventName,AttributeValue=GenerateRandom \
  --query "Events[?Username==\`$INSTANCE_ID\`]"
```
