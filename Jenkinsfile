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
              - name: node
                image: node:14
                command:
                - cat
                tty: true
                volumeMounts:
                - name: docker-socket
                  mountPath: /var/run/docker.sock
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
        DOCKER_HUB_REPO = 'heebin00/awsfront' // 도커 허브 레포 이름을 직접 지정
    }
    
    stages {
        stage('git clone') {
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
    }
}
