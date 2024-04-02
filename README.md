# EdgeCloud

## Docker
Install [Docker](https://docs.docker.com/engine/install/ubuntu/) and follow [Post-installation steps for Linux](https://docs.docker.com/engine/install/linux-postinstall/)

You can also use this script to install the docker in one step:
```bash
./docker/install_docker.sh
```
After docker is installed, use the following script to perform the post-installation, i.e., rootless:
```bash
./docker/install_dockerpost.sh
```
Verify the docker installation via the following script:
```bash
./docker/verify_docker.sh
```


## Nvidia Container Runtime
Setup Docker and nvidia container runtime via [nvidiacontainer1](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/install-guide.html) [nvidiacontainer2](https://docs.nvidia.com/dgx/nvidia-container-runtime-upgrade/index.html
)

You can use this automatic script to install nvidia container runtime:
```bash
./docker/install_postnvidiacontainer.sh
```

## Run Containers
After you build the container, you can check the new container via "docker images", note down the image id, and run this image:
```bash
sudo docker run -it --rm 486a56765aad
```
After you entered the container and did changes inside the container, click "control+P+Q" to exit the container without terminate the container. Use "docker ps" to check the container id, then use "docker commit" to commit changes:
```bash
docker commit -a "Kaikai Liu" -m "First ROS2-x86 container" 196073a381b4 myros2:v1
```
Now, you can see your newly created container image named "myros2:v1" in "docker images".

You can now start your ROS2 container (i.e., myros2:v1) via runcontainer.sh, change the script file if you want to change the path of mounted folders. 
```bash
sudo xhost +si:localuser:root
./scripts/runcontainer.sh [containername]
```
after you 
Re-enter a container: use the command "docker exec -it container_id /bin/bash" to get a bash shell in the container.

Popular Docker commands:
 * Stop a running container: docker stop container_id
 * Stop all containers not running: docker container prune
 * Delete docker images: docker image rm dockerimageid


## Install K3S
[K3s](https://docs.k3s.io/installation). Install K3s using the Installation Script via [K3squickstart](https://docs.k3s.io/quick-start). The installation script is the easiest way to set up K3s as a service on systemd and openrc based systems. Run the following command on the master node to install K3s and start the service automatically:
```bash
curl -sfL https://get.k3s.io | sh -
#After successful installation, verify the K3s service status using:
sudo systemctl restart k3s
sudo systemctl status k3s
```
Additional utilities will be installed, including kubectl, crictl, ctr, k3s-killall.sh, and k3s-uninstall.sh. A kubeconfig file will be written to /etc/rancher/k3s/k3s.yaml and the kubectl installed by K3s will automatically use it.

If you want to uninstall k3s, run the following script:
```bash
/usr/local/bin/k3s-agent-uninstall.sh #Uninstall K3s from Agent Nodes
/usr/local/bin/k3s-uninstall.sh
rm -rf /var/lib/rancher/k3s
```

You can also install and uninstall K3S via our script
```bash
lkk@dellr530:~/MyRepo/DeepDataMiningLearning/docker$ ./k3s-install.sh
./k3s-uninstall.sh
```


A single-node server installation is a fully-functional Kubernetes cluster, including all the datastore, control-plane, kubelet, and container runtime components necessary to host workload pods. It is not necessary to add additional server or agents nodes, but you may want to do so to add additional capacity or redundancy to your cluster.
```bash
#check server address
lkk@dellr530:~/MyRepo/EdgeCloud$ kubectl config view --minify -o jsonpath='{.clusters[0].cluster.server}'
https://127.0.0.1:6443
$ kubectl get nodes
NAME       STATUS   ROLES                  AGE   VERSION
dellr530   Ready    control-plane,master   24s   v1.28.8+k3s1
```

If your system has MicroK8S installed and running, you need to remove MicroK8S
```bash
sudo microk8s reset
sudo snap remove microk8s
sudo microk8s disable
sudo microk8s status
```

You can verify by listing all the Kubernetes objects in the kube-system namespace.
```bash
$ kubectl get all -n kube-system
$ kubectl get pods --all-namespaces #check which containers (pods) get created
NAMESPACE     NAME                                      READY   STATUS      RESTARTS   AGE
kube-system   coredns-6799fbcd5-tgbv9                   1/1     Running     0          2m14s
kube-system   local-path-provisioner-6c86858495-gth54   1/1     Running     0          2m14s
kube-system   helm-install-traefik-crd-b7wgn            0/1     Completed   0          2m14s
kube-system   helm-install-traefik-vgs59                0/1     Completed   1          2m14s
kube-system   svclb-traefik-b18a0d17-f67d9              2/2     Running     0          108s
kube-system   metrics-server-54fd9b65b-cwvsm            1/1     Running     0          2m14s
kube-system   traefik-f4564c4f4-tsw86                   1/1     Running     0          108s
$ kubectl get pods
No resources found in default namespace.
```

Check K3S cluster info:
```bash
lkk@dellr530:~/MyRepo/EdgeCloud$ kubectl --kubeconfig=/etc/rancher/k3s/k3s.yaml cluster-info
Kubernetes control plane is running at https://127.0.0.1:6443
CoreDNS is running at https://127.0.0.1:6443/api/v1/namespaces/kube-system/services/kube-dns:dns/proxy
Metrics-server is running at https://127.0.0.1:6443/api/v1/namespaces/kube-system/services/https:metrics-server:https/proxy

To further debug and diagnose cluster problems, use 'kubectl cluster-info dump'.
```

We can see a basic K3s setup composed by:
    * Traefik as an ingress controller for HTTP reverse proxy and load balancing
    * CoreDns to manage DNS resolution inside the cluster and nodes
    * Local Path Provisioner provides a way to utilize the local storage in each node
    * Helm, which we can use to customize packaged components

Instead of running components in different processes, K3s will run all in a single server or agent process. As it is packaged in a single file, we can also work offline, using an Air-gap installation. Interestingly, we can also run K3s in Docker using K3d.

## Kubernetes Basics
Kubernetes helps you make sure containerized applications run where and when you want, and helps them find the resources and tools they need to work. Once you have a running Kubernetes cluster, you can deploy your containerized applications on top of it. To do so, you create a Kubernetes Deployment. The Deployment instructs Kubernetes how to create and update instances of your application. Once you've created a Deployment, the Kubernetes control plane schedules the application instances included in that Deployment to run on individual Nodes in the cluster. Once the application instances are created, a Kubernetes Deployment controller continuously monitors those instances. If the Node hosting an instance goes down or is deleted, the Deployment controller replaces the instance with an instance on another Node in the cluster. This provides a self-healing mechanism to address machine failure or maintenance. By both creating your application instances and keeping them running across Nodes, Kubernetes Deployments provide a fundamentally different approach to application management.

You can create and manage a Deployment by using the Kubernetes command line interface, **kubectl**. Kubectl uses the Kubernetes API to interact with the cluster. The common format of a kubectl command is: `kubectl action resource`. You can check the version of kubectl: `kubectl version --short`

When you created a Deployment, Kubernetes created a Pod to host your application instance. A Kubernetes Pod is a group of one or more Containers, tied together for the purposes of administration and networking. A Pod is a Kubernetes abstraction that represents a group of one or more application containers (such as Docker), and some shared resources for those containers. Those resources include: 1)Shared storage, as Volumes; 2) Networking, as a unique cluster IP address; 3) Information about how to run each container, such as the container image version or specific ports to use. A Pod models an application-specific "logical host" and can contain different application containers which are relatively tightly coupled. Pods are the atomic unit on the Kubernetes platform. When we create a Deployment on Kubernetes, that Deployment creates Pods with containers inside them (as opposed to creating containers directly). A Kubernetes Deployment checks on the health of your Pod and restarts the Pod's Container if it terminates. Deployments are the recommended way to manage the creation and scaling of Pods.

Each Pod is tied to the Node where it is scheduled, and remains there until termination (according to restart policy) or deletion. In case of a Node failure, identical Pods are scheduled on other available Nodes in the cluster. A Pod always runs on a Node. A Node is a worker machine in Kubernetes and may be either a virtual or a physical machine, depending on the cluster. Each Node is managed by the control plane. A Node can have multiple pods, and the Kubernetes control plane automatically handles scheduling the pods across the Nodes in the cluster. The control plane's automatic scheduling takes into account the available resources on each Node. Every Kubernetes Node runs at least: 1) Kubelet, a process responsible for communication between the Kubernetes control plane and the Node; it manages the Pods and the containers running on a machine. 2) A container runtime (like Docker) responsible for pulling the container image from a registry, unpacking the container, and running the application.

Use the kubectl create command to create a Deployment that manages a Pod. The Pod runs a Container based on the provided Docker image. When you create a Deployment, you'll need to specify the container image for your application and the number of replicas that you want to run. This example is a hello-node application packaged in a Docker container that uses NGINX to echo back all the requests.
```bash
# Run a test container image that includes a webserver
lkk@dellr530:~/MyRepo/EdgeCloud$ kubectl create deployment hello-node --image=registry.k8s.io/e2e-test-images/agnhost:2.39 -- /agnhost netexec --http-port=8080
lkk@dellr530:~/MyRepo/EdgeCloud$ kubectl get deployments
NAME         READY   UP-TO-DATE   AVAILABLE   AGE
hello-node   1/1     1            1           3m46s
```
Create a Kubernetes deployment (hello-node) using the specified image (agnhost:2.39) and run the netexec tool inside the container on port 8080. `--image` specifies the Docker image to use for the deployment. runs the `/agnhost netexec` command inside the container. The netexec tool is part of the agnhost image. The --http-port=8080 flag indicates that the netexec tool should listen on port 8080.

The most common operations can be done with the following kubectl subcommands:
  * `kubectl get` - list resources
  * `kubectl describe` - show detailed information about a resource
  * `kubectl logs` - print the logs from a container in a pod
  * `kubectl exec` - execute a command on a container in a pod

See the pod information. We'll use the kubectl get command and look for existing Pods:
```bash
#view the pods
lkk@dellr530:~/MyRepo/EdgeCloud$ kubectl get pods
NAME                         READY   STATUS    RESTARTS   AGE
hello-node-ccf4b9788-nk2dn   1/1     Running   0          4m36s
lkk@dellr530:~/MyRepo/EdgeCloud$ kubectl describe pod hello-node-ccf4b9788-nk2dn
```
To view what containers are inside that Pod and what images are used to build those containers we run the `kubectl describe pods` command. We see here details about the Pod’s container: IP address, the ports used and a list of events related to the lifecycle of the Pod.

View cluster events:
```bash
kubectl get events #You can see the timeline of the events
```

View the kubectl configuration:
```bash
lkk@dellr530:~/MyRepo/EdgeCloud$ kubectl config view
```

View application logs for a container in a pod.
```bash
lkk@dellr530:~/MyRepo/EdgeCloud$ kubectl logs hello-node-ccf4b9788-nk2dn
I0402 16:56:26.527763       1 log.go:195] Started HTTP server on port 8080
I0402 16:56:26.527904       1 log.go:195] Started UDP server on port  8081
```

By default, the Pod is only accessible by its internal IP address within the Kubernetes cluster (running inside Kubernetes are running on a private, isolated network). By default they are visible from other pods and services within the same Kubernetes cluster, but not outside that network. 


To make the hello-node Container accessible from outside the Kubernetes virtual network, you have two options: 1) The `kubectl proxy` command can create a proxy that will forward communications into the cluster-wide, private network; 2) expose the Pod as a **Kubernetes Service**.

Expose the Pod to the public internet using the kubectl expose command:
```bash
lkk@dellr530:~/MyRepo/EdgeCloud$ kubectl expose deployment hello-node --type=LoadBalancer --port=8080
service/hello-node exposed
```
> The --type=LoadBalancer flag indicates that you want to expose your Service outside of the cluster. The application code inside the test image only listens on TCP port 8080. If you used kubectl expose to expose a different port, clients could not connect to that other port.

View the Service you created:
```bash
lkk@dellr530:~/MyRepo/EdgeCloud$ kubectl get services
NAME         TYPE           CLUSTER-IP      EXTERNAL-IP      PORT(S)          AGE
kubernetes   ClusterIP      10.43.0.1       <none>           443/TCP          25m
hello-node   LoadBalancer   10.43.126.242   130.65.157.217   8080:32659/TCP   67s
```
You can access the server via the browser "http://130.65.157.217:8080/"

You can clean up the resources you created in your cluster:
```bash
kubectl delete service hello-node
kubectl delete deployment hello-node
```

## K3S Nginx Server
Test Nginx image with 2 replicas available on port 80:
```bash
$ kubectl create deployment nginx --image=nginx --port=80 --replicas=2
deployment.apps/nginx created
lkk@dellr530:~/MyRepo/DeepDataMiningLearning/docker$ kubectl get pods
NAME                     READY   STATUS    RESTARTS   AGE
nginx-7c5ddbdf54-5nczm   1/1     Running   0          22s
nginx-7c5ddbdf54-cc5wv   1/1     Running   0          22s
```
Pods are not permanent resources and get created and destroyed constantly. Therefore, we need a Service to map the pods’ IPs to the outer world dynamically. Services can be of different types. We'll choose a ClusterIp. In Kubernetes, a ClusterIP is a virtual IP address assigned to a Service. In Kubernetes, a Service is an abstract way to expose an application running on a set of Pods. Services allow clients (both inside and outside the cluster) to connect to the application. They provide load balancing across the different backing Pods.

A ClusterIP is a type of Service that has a cluster-scoped virtual IP address. Clients within the Kubernetes cluster can connect to this virtual IP address. Kubernetes then load-balances traffic to the Service across the different Pods associated with it.

```bash
kubectl create service clusterip nginx --tcp=80:80
kubectl describe service nginx
```
creates a ClusterIP Service named "nginx" that exposes port 80 within the Kubernetes cluster. kubectl create service is the command to create a Kubernetes service. clusterip specifies the type of service. In this case, it’s a ClusterIP Service. nginx is the name of the service being created. The port format is "--tcp=<external-port>:<internal-port>", 80:80 means that external traffic hitting port 80 will be directed to the Pods associated with this service on port 80.

We can see the Endpoints corresponding to the pods (or containers) addresses where we can reach our applications. Services don’t have direct access. An Ingress Controller is usually in front of them for caching, load balancing, and security reasons, such as filtering out malicious requests. Finally, let’s define a Traefik controller in a YAML file. This will route the traffic from the incoming request to the service:

```bash
lkk@dellr530:~$ nano traefik_nginx.yaml
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: nginx
  annotations:
    ingress.kubernetes.io/ssl-redirect: "false"
spec:
  rules:
  - http:
      paths:
      - path: /
        pathType: Prefix
        backend:
          service:
            name: nginx
            port:
              number: 80
lkk@dellr530:~$ kubectl apply -f traefik_nginx.yaml
ingress.networking.k8s.io/nginx created
lkk@dellr530:~$ kubectl describe ingress nginx #describe our ingress controller:
Name:             nginx
Labels:           <none>
Namespace:        default
Address:          130.65.157.217
Ingress Class:    traefik
Default backend:  <default>
Rules:
  Host        Path  Backends
  ----        ----  --------
  *
              /   nginx:80 (10.42.0.10:80,10.42.0.9:80)
Annotations:  ingress.kubernetes.io/ssl-redirect: false
Events:       <none>
lkk@dellr530:~$ kubectl get pods,services,endpointslices
NAME                         READY   STATUS    RESTARTS   AGE
pod/nginx-7c5ddbdf54-5nczm   1/1     Running   0          88m
pod/nginx-7c5ddbdf54-cc5wv   1/1     Running   0          88m

NAME                 TYPE        CLUSTER-IP    EXTERNAL-IP   PORT(S)   AGE
service/kubernetes   ClusterIP   10.43.0.1     <none>        443/TCP   101m
service/nginx        ClusterIP   10.43.40.47   <none>        80/TCP    7m8s

NAME                                         ADDRESSTYPE   PORTS   ENDPOINTS              AGE
endpointslice.discovery.k8s.io/kubernetes    IPv4          6443    130.65.157.217         101m
endpointslice.discovery.k8s.io/nginx-k5cpb   IPv4          80      10.42.0.9,10.42.0.10   7m8s
```
Open the link of "130.65.157.217" can open the nginx server frontpage.

Access the NGINX Pod: find the name of the NGINX Pod you want to access. You can list all Pods in the current namespace using:
```bash
lkk@dellr530:~$ kubectl get pods
NAME                     READY   STATUS    RESTARTS   AGE
nginx-7c5ddbdf54-5nczm   1/1     Running   0          92m
nginx-7c5ddbdf54-cc5wv   1/1     Running   0          92m
lkk@dellr530:~$ kubectl exec -it nginx-7c5ddbdf54-5nczm -- /bin/bash
root@nginx-7c5ddbdf54-5nczm:/# cat /etc/nginx/nginx.conf
#If you made changes to the configuration, restart NGINX inside the Pod: service nginx restart
#exit the Pod by typing exit
```
Delete deployment:
```bash
lkk@dellr530:~/MyRepo/EdgeCloud$ kubectl get deployments
lkk@dellr530:~/MyRepo/EdgeCloud$ kubectl delete deployment nginx
```

Delete resources. If your Pods are managed by a Deployment (which is common in production environments), consider scaling down the Deployment to zero replicas:
```bash
kubectl scale deployment nginx --replicas=0
lkk@dellr530:~$ kubectl delete pods --all
pod "nginx-7c5ddbdf54-5nczm" deleted
pod "nginx-7c5ddbdf54-cc5wv" deleted
lkk@dellr530:~$ kubectl delete services --all
service "kubernetes" deleted
service "nginx" deleted
lkk@dellr530:~$ kubectl delete -f traefik_nginx.yaml
ingress.networking.k8s.io "nginx" deleted
lkk@dellr530:~$ kubectl delete endpointslice --all
endpointslice.discovery.k8s.io "kubernetes" deleted
lkk@dellr530:~$ kubectl get pods,services,endpointslices
```

You can also forcefully delete one pod:
```bash
$ kubectl describe pod [pod_name] -n [namespace]
$ docker ps
#Once it's verified that the container isn't present, run the following command to delete the pod forcefully.
$ kubectl delete pod [pod_name] -n [namespace] --grace-period 0 --force
```

## K3S Jupyter
Set up a Jupyter Lab pod in K3s cluster 
```bash
lkk@dellr530:~$ kubectl create deployment jupyter-lab --image=jupyter/base-notebook
deployment.apps/jupyter-lab created
lkk@dellr530:~$ kubectl get pods
NAME                          READY   STATUS              RESTARTS   AGE
jupyter-lab-d7bdfb78b-q4pj4   0/1     ContainerCreating   0          11s
lkk@dellr530:~$ kubectl expose deployment jupyter-lab --type=ClusterIP --port=8888 #Expose the Deployment as a Service:
service/jupyter-lab exposed
#To access Jupyter Lab from your local browser, you’ll need to forward the port
lkk@dellr530:~$ kubectl port-forward service/jupyter-lab 8888:8888
Forwarding from 127.0.0.1:8888 -> 8888
Forwarding from [::1]:8888 -> 8888
lkk@dellr530:~$ kubectl describe service jupyter-lab
lkk@dellr530:~$ kubectl exec -it pod/jupyter-lab-d7bdfb78b-q4pj4 -- /bin/bash
```
In 'image' part, The hostname of the container image registry (e.g., Docker Hub, Google Container Registry, etc.). If omitted, Kubernetes assumes the Docker public registry. Open your web browser and visit "http://130.65.157.217:8888". You should see the Jupyter Lab interface.

## Helm
Install Helm
```bash
curl https://raw.githubusercontent.com/helm/helm/HEAD/scripts/get-helm-3 | bash
lkk@dellr530:~$ helm version
WARNING: Kubernetes configuration file is group-readable. This is insecure. Location: /home/lkk/.kube/config
WARNING: Kubernetes configuration file is world-readable. This is insecure. Location: /home/lkk/.kube/config
version.BuildInfo{Version:"v3.14.3", GitCommit:"f03cc04caaa8f6d7c3e67cf918929150cf6f3f12", GitTreeState:"clean", GoVersion:"go1.21.7"}
https://www.digitalocean.com/community/tutorials/how-to-setup-k3s-kubernetes-cluster-on-ubuntu
```

Execute the following command to see all Kubernetes objects deployed in the cluster in the kube-system namespace. kubectl is installed automatically during the K3s installation and thus does not need to be installed individually.


## K3S GPU Access
Installing the NVIDIA drivers on the K3s node. 

The second step is to install the [NVIDIA Container Toolkit](https://docs.nvidia.com/datacenter/cloud-native/container-toolkit/overview.html), which helps to expose the GPU resources from the K3S node to the containers running on it. The third step is to tell K3S to use this toolkit to enable GPUs on the containers. One point to pay attention to is to install only the containerd version of the toolkit. K3S does not use Docker at all, since Kubernetes already deprecated Docker, and it uses only the containerd to manage containers. Installing also the Docker support won’t impact how your cluster works since it will also implicitly install the containerd support, but since we avoid installing unnecessary packages on our lean Kubernetes nodes, we directly go with the containerd installation. ()


Step 3: Configure K3S to use nvidia-container-runtime. Tell K3S to use nvidia-container-runtime (which is a kind of plugin of containerd) on the containerd of our node. K3D's tutorial (https://k3d.io/usage/guides/cuda/#configure-containerd). The only part we are interested in in that guide is the “Configure containerd” section. The template they have shared is configuring the containerd to use the nvidia-container-runtime plugin, together with a couple of more extra boilerplate settings. To install that template to our node, we can simply run the following command:

```bash
    sudo wget https://k3d.io/v4.4.8/usage/guides/cuda/config.toml.tmpl -O /var/lib/rancher/k3s/agent/etc/containerd/config.toml.tmpl
```

Step 4: Install NVIDIA device plugin for Kubernetes. The [NVIDIA device plugin for Kubernetes](https://github.com/NVIDIA/k8s-device-plugin) is a DaemonSet that scans the GPUs on each node and exposes them as GPU resources to our Kubernetes nodes.

If you follow the documentation of the device plugin, there is also a Helm chart available to install it. On K3S, we have a simple Helm controller that allows us to install Helm charts on our cluster. Let us leverage it and deploy this Helm chart:

```bash
    cat <<EOF | kubectl apply -f -
    apiVersion: helm.cattle.io/v1
    kind: HelmChart
    metadata:
    name: nvidia-device-plugin
    namespace: kube-system
    spec:
    chart: nvidia-device-plugin
    repo: https://nvidia.github.io/k8s-device-plugin
    EOF
```
you can install the device plugin also by applying the manifest directly or by installing the chart using “helm install”.

> A Helm Chart is a package that contains all the necessary resources to deploy an application on a Kubernetes cluster. A Helm Chart serves as a blueprint or template for deploying applications on Kubernetes. It includes all the Kubernetes resource YAML manifest files needed to run the application. In addition to Kubernetes manifests, a Helm Chart directory structure contains other files specific to Helm, such as:
Chart.yaml: Defines metadata about the chart (e.g., name, version, dependencies). values.yaml: Contains default configuration values that can be overridden during installation. Templates (Go templates): Used to render Kubernetes manifests dynamically based on user-defined values.

Step 5: Test everything on a CUDA-enabled Pod. Finally, we can test everything by creating a Pod that uses the CUDA Docker image and requests a GPU resource:
```bash
    cat <<EOF | kubectl create -f -
    apiVersion: v1
    kind: Pod
    metadata:
    name: gpu
    spec:
    restartPolicy: Never
    containers:
        - name: gpu
        image: "nvidia/cuda:11.4.1-base-ubuntu20.04"
        command: [ "/bin/bash", "-c", "--" ]
        args: [ "while true; do sleep 30; done;" ]
        resources:
            limits:
            nvidia.com/gpu: 1
    EOF
```
Finally let us run the nvidia-smi on our Pod:
```bash
    kubectl exec -it gpu -- nvidia-smi
```
[Kubernets documentation](https://kubernetes.io/docs/tasks/manage-gpus/scheduling-gpus/)
