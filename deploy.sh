# Setup gcloud
echo "Listing projects"
gcloud projects list
echo "Specify the project ID for deployment"
project_id=""
read project_id
if [ -z "$project_id" ]
then
    echo "Project ID is empty"
    exit 1
fi

gcloud config set project $project_id

# Prepare for deployment
gcloud app deploy --project=$project_id ./frontend/app.yml
