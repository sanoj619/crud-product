pipeline {
    agent any
    environment {
        DOCKER_IMAGE = "sanoj619/crud-product:${env.BUILD_NUMBER}"
        KUBE_DEPLOYMENT = "springboot-crud-app"
        SLACK_WEBHOOK_URL = credentials('slack-webhook-url')
    }
    stages {
        stage('Checkout') {
            steps {
                git branch: 'main', url: 'https://github.com/sanoj619/crud-product.git'
            }
        }
        stage('Build') {
            steps {
                bat 'mvn clean package -DskipTests'
            }
        }
        stage('Docker Build & Push') {
            steps {
                script {
                    docker.withRegistry('', 'dockerhub-credentials') {
                        def app = docker.build(DOCKER_IMAGE)
                        app.push()
                    }
                }
            }
        }
        stage('Deploy to Kubernetes') {
            steps {
                bat 'kubectl apply -f k8s\\deployment.yaml'
                bat 'kubectl apply -f k8s\\service.yaml'
            }
        }
    }
    post {
        success {
            slackSend (color: '#36a64f', message: "SUCCESS: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' succeeded", webhookUrl: SLACK_WEBHOOK_URL)
        }
        failure {
            slackSend (color: '#FF0000', message: "FAILED: Job '${env.JOB_NAME} [${env.BUILD_NUMBER}]' failed", webhookUrl: SLACK_WEBHOOK_URL)
        }
    }
}
