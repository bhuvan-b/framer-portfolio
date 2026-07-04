pipeline {
    agent any
    
    parameters {
        string(
            name: 'BRANCH_NAME', 
            defaultValue: 'master', 
            description: 'GitHub Repository Branch name to be deployed'
        )
        choice(
            name: 'ENVIRONMENT', 
            choices: ['dev', 'staging', 'prod'], 
            description: 'Select the target environment'
        )
        string(
            name: 'TARGET_HOST', 
            defaultValue: '', 
            description: 'IP/Hostname of deployment target server'
        )
        booleanParam(
            name: 'DELETE_EXISTING_IMAGES', 
            defaultValue: true, 
            description: 'Check this box to delete the existing images'
        )
    }

    stages {
        stage('SSH Check') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'bokkabh',
                    keyFileVariable: 'SSH_KEY',
                    usernameVariable: 'SSH_USER'
                )]) {
                    sh '''
                        ssh -i $SSH_KEY \
                            -o StrictHostKeyChecking=no \
                            $SSH_USER@$TARGET_HOST \
                            "ls -lrt"
                    '''
                }
            }
        }
        stage('Stop Existing Container') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'bokkabh',
                    keyFileVariable: 'SSH_KEY',
                    usernameVariable: 'SSH_USER'
                )]) {
                    sh '''
                        ssh -i $SSH_KEY \
                            -o StrictHostKeyChecking=no \
                            $SSH_USER@$TARGET_HOST \
                            "
                            docker stop bhuvan-framer-$ENVIRONMENT || true
                            docker rm bhuvan-framer-$ENVIRONMENT || true
                            "
                    '''
                }
            }
        }
        stage('Delete Existing Docker Image') {
            when {
                expression { params.DELETE_EXISTING_IMAGES }
            }
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'bokkabh',
                    keyFileVariable: 'SSH_KEY',
                    usernameVariable: 'SSH_USER'
                )]) {
                    sh '''
                        ssh -i $SSH_KEY \
                            -o StrictHostKeyChecking=no \
                            $SSH_USER@$TARGET_HOST \
                            "
                            docker rmi framerapp:$BRANCH_NAME || true
                            "
                    '''
                }
            }
        }
        stage('Build Docker Image') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'bokkabh',
                    keyFileVariable: 'SSH_KEY',
                    usernameVariable: 'SSH_USER'
                )]) {
                    sh '''
                        ssh -i $SSH_KEY \
                            -o StrictHostKeyChecking=no \
                            $SSH_USER@$TARGET_HOST \
                            "cd /home/bokkabh/framer && docker build -t framerapp:$BRANCH_NAME ."
                    '''
                }
            }
        }
        stage('Run Docker Container') {
            steps {
                withCredentials([sshUserPrivateKey(
                    credentialsId: 'bokkabh',
                    keyFileVariable: 'SSH_KEY',
                    usernameVariable: 'SSH_USER'
                )]) {
                    sh '''
                        ssh -i $SSH_KEY \
                            -o StrictHostKeyChecking=no \
                            $SSH_USER@$TARGET_HOST \
                            "docker run -d -p 3000:3000 --name bhuvan-framer-$ENVIRONMENT framerapp:$BRANCH_NAME"
                    '''
                }
            }
        }
    }
}
