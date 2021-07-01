#!/bin/bash

set -euo pipefail

# remove this if you want to create a new account
echo "already created"
exit

set -x

# change the stage here
stage="staging"

gcloud iam service-accounts create gsm-$stage

gcloud iam service-accounts add-iam-policy-binding \
  --role roles/iam.workloadIdentityUser \
  --member "serviceAccount:meetnomoreapp.svc.id.goog[$stage/gsm]" \
  gsm-$stage@meetnomoreapp.iam.gserviceaccount.com

gcloud projects add-iam-policy-binding meetnomoreapp \
  --role roles/cloudsql.client \
  --member "serviceAccount:gsm-$stage@meetnomoreapp.iam.gserviceaccount.com"

gcloud projects add-iam-policy-binding meetnomoreapp \
  --role roles/secretmanager.viewer \
  --member "serviceAccount:gsm-$stage@meetnomoreapp.iam.gserviceaccount.com"
