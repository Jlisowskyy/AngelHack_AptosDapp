# Prepare for deployment
gcloud projects list
echo "Enter the project ID for deployment"
read project_id
gcloud app deploy --project=$project_id ./frontend/app.yml
