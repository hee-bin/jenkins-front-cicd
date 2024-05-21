pipeline {
    agent {
        kubernetes {
            label 'jenkins-agent'
            yaml """
            apiVersion: v1
            kind: Pod
            spec:
              containers:
              - name: jnlp
                image: jenkins/inbound-agent:latest
                args: ['\$(JENKINS_SECRET)', '\$(JENKINS_NAME)']
              - name: docker
                image: docker:20.10
                command:
                - cat
                tty: true
                volumeMounts:
                - name: docker-socket
                  mountPath: /var/run/docker.sock
              - name: kubectl
                image: bitnami/kubectl:latest
                command:
                - cat
                tty: true
              volumes:
              - name: docker-socket
                hostPath:
                  path: /var/run/docker.sock
                  type: Socket
            """
        }
    }
    environment {
        GIT_CREDENTIALS_ID = 'git-token'
        DOCKER_HUB_REPO = 'heebin00/awsfront2' // 도커 허브 레포 이름을 직접 지정
        KUBECONFIG_CREDENTIALS_ID = 'kubeconfig' // Kubeconfig 파일의 Jenkins credentials ID
        SLACK_CHANNEL = '#deploy-noti'
        SLACK_CREDENTIAL_ID = 'slack-token'
    }
    
    stages {
        stage('git clone') {
            steps {
                container('jnlp') {
                    git credentialsId: env.GIT_CREDENTIALS_ID, branch: 'main', url: 'https://github.com/hee-bin/jenkins-front-cicd.git'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                container('docker') {
                    script {
                        def customImage = docker.build("kube-employment-frontend:${env.BUILD_ID}")
                    }
                }
            }
        }
        
        stage('Push Docker Image') {
            steps {
                container('docker') {
                    script {
                        withCredentials([usernamePassword(credentialsId: 'dockerHub-token', usernameVariable: 'DOCKERHUB_USER', passwordVariable: 'DOCKERHUB_PASS')]) {
                            sh "echo ${DOCKERHUB_PASS} | docker login -u ${DOCKERHUB_USER} --password-stdin"
                            sh "docker tag kube-employment-frontend:${env.BUILD_ID} ${DOCKER_HUB_REPO}:${env.BUILD_ID}"
                            sh "docker push ${DOCKER_HUB_REPO}:${env.BUILD_ID}"
                            sh "docker tag kube-employment-frontend:${env.BUILD_ID} ${DOCKER_HUB_REPO}:latest"
                            sh "docker push ${DOCKER_HUB_REPO}:latest"
                        }
                    }
                }
            }
        }

        stage('Deploy to Kubernetes') {
            steps {
                container('kubectl') {
                    script {
                        withCredentials([file(credentialsId: env.KUBECONFIG_CREDENTIALS_ID, variable: 'KUBECONFIG')]) {
                            sh 'kubectl apply -f k8s/deployment.yml'
                        }
                    }
                }
            }
        }
    }

    post {
        always {
            script {
                slackSend(channel: env.SLACK_CHANNEL, message: "Build ${currentBuild.fullDisplayName} finished with status: ${currentBuild.currentResult}")
            }
        }
        success {
            script {
                slackSend(channel: env.SLACK_CHANNEL, message: "Build ${currentBuild.fullDisplayName} succeeded")
            }
        }
        failure {
            script {
                slackSend(channel: env.SLACK_CHANNEL, message: "Build ${currentBuild.fullDisplayName} failed")
            }
        }
    }
}
