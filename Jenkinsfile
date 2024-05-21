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
                image: lachlanevenson/k8s-kubectl:latest
                command:
                - cat
                tty: true
                volumeMounts:
                - name: kube-config
                  mountPath: /root/.kube
              volumes:
              - name: docker-socket
                hostPath:
                  path: /var/run/docker.sock
                  type: Socket
              - name: kube-config
                configMap:
                  name: kube-config
            """
        }
    }
    environment {
        GIT_CREDENTIALS_ID = 'git-token'
        DOCKER_HUB_REPO = 'heebin00/awsfront2'
        SLACK_CHANNEL = '#일반'
        SLACK_CREDENTIAL_ID = 'slack-token'
        KUBECONFIG_PATH = '/root/.kube/config'
    }
    
    stages {
        stage('Clone Repository') {
            steps {
                container('jnlp') {
                    git credentialsId: env.GIT_CREDENTIALS_ID, branch: 'main', url: 'https://github.com/hee-bin/frontend-cicd-test.git'
                }
            }
        }
        
        stage('Build Docker Image') {
            steps {
                container('docker') {
                    script {
                        def customImage = docker.build("${DOCKER_HUB_REPO}:${env.BUILD_ID}")
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
                            sh "docker tag ${DOCKER_HUB_REPO}:${env.BUILD_ID} ${DOCKER_HUB_REPO}:${env.BUILD_ID}"
                            sh "docker push ${DOCKER_HUB_REPO}:${env.BUILD_ID}"
                            sh "docker tag ${DOCKER_HUB_REPO}:${env.BUILD_ID} ${DOCKER_HUB_REPO}:latest"
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
                        withEnv(["KUBECONFIG=${env.KUBECONFIG_PATH}"]) {
                            def deploymentExists = sh(script: 'kubectl get deployment frontend', returnStatus: true) == 0
                            if (deploymentExists) {
                                sh 'kubectl set image deployment/frontend frontend=${DOCKER_HUB_REPO}:${env.BUILD_ID} --record'
                            } else {
                                sh 'kubectl apply -f test.yml'
                            }
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
