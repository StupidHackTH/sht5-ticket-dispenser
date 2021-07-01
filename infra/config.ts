import * as gcp from '@pulumi/gcp'
import * as pulumi from '@pulumi/pulumi'

export const projectName = 'sht5-ticket'

export const imageName = pulumi.interpolate`asia.gcr.io/${gcp.config.project}/${projectName}:latest`
