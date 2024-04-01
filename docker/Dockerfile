# Docker file to build on x86_64 cuda11.7, Ubuntu22.04
# docker build -t ubuntu22cuda117 .
# docker run -it ubuntu22cuda117

FROM nvidia/cuda:11.7.1-devel-ubuntu22.04

# disable terminal interaction for apt
ENV DEBIAN_FRONTEND=noninteractive
ENV SHELL /bin/bash
SHELL ["/bin/bash", "-c"] 

# NVIDIA repository keys: https://developer.nvidia.com/blog/updating-the-cuda-linux-gpg-repository-key/
# RUN apt-key del 7fa2af80 && mkdir -p /tmp && cd /tmp \
#         && wget https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/cuda-keyring_1.0-1_all.deb \
#         && dpkg -i cuda-keyring_1.0-1_all.deb \
#         && rm cuda-keyring_1.0-1_all.deb \
#         && add-apt-repository --remove 'deb https://developer.download.nvidia.com/compute/cuda/repos/ubuntu2204/x86_64/ /'

# Fundamentals
RUN apt-get update && apt-get install -y \
        apt-transport-https \
        bash-completion \
        build-essential \
        ca-certificates \
        clang-format \
        cmake \
        curl \
        git \
        gnupg2 \
        locales \
        lsb-release \
        rsync \
        software-properties-common \
        wget \
        vim \
        unzip \
        mlocate \
	libgoogle-glog-dev \
        x11-apps \
&& rm -rf /var/lib/apt/lists/* \
&& apt-get clean

# Set Python3 as default
RUN update-alternatives --install /usr/bin/python python /usr/bin/python3 1

# Python basics
RUN apt-get update && apt-get install -y \
        python3-pip \
        python3-pybind11 \
        python3-pytest-cov \
        python3-setuptools \
&& rm -rf /var/lib/apt/lists/* \
&& apt-get clean

# Video utilities
RUN apt-get update && apt-get install -y \
        v4l-utils \
        mesa-utils \
        libcanberra-gtk-module \
        libcanberra-gtk3-module \
&& rm -rf /var/lib/apt/lists/* \
&& apt-get clean

# Core dev libraries
RUN apt-get update && apt-get install -y \
        libasio-dev \
        libbullet-dev \
        libtinyxml2-dev \
        libcunit1-dev \
        libopencv-dev \
        python3-opencv \
&& rm -rf /var/lib/apt/lists/* \
&& apt-get clean
        
# Python3 (PIP)
RUN python3 -m pip install -U \
        argcomplete \
        autopep8 \
        flake8==4.0.1 \
        flake8-blind-except \
        flake8-builtins \
        flake8-class-newline \
        flake8-comprehensions \
        flake8-deprecated \
        flake8-docstrings \
        flake8-import-order \
        flake8-quotes \
        onnx \
        pytest-repeat \
        pytest-rerunfailures \
        pytest \
        pydocstyle \
        scikit-learn

# Install Git-LFS
RUN curl -s https://packagecloud.io/install/repositories/github/git-lfs/script.deb.sh | bash && \
        apt-get update && apt-get install -y \
        git-lfs \
&& rm -rf /var/lib/apt/lists/* \
&& apt-get clean

# Upgrade cmake to 3.23.2
# RUN wget -O - https://apt.kitware.com/keys/kitware-archive-latest.asc 2>/dev/null | gpg --dearmor - | tee /usr/share/keyrings/kitware-archive-keyring.gpg >/dev/null \
#     && echo 'deb [signed-by=/usr/share/keyrings/kitware-archive-keyring.gpg] https://apt.kitware.com/ubuntu/ focal main' | tee /etc/apt/sources.list.d/kitware.list >/dev/null \
#     && apt-get update \
#     && apt-get update \
#     && apt-get remove -y cmake && apt-get purge -y cmake && apt-get remove -y cmake-data && apt-get purge -y cmake \
#     && apt-get install -y cmake=3.23.2-0kitware1ubuntu20.04.1 cmake-data=3.23.2-0kitware1ubuntu20.04.1 \
#     && cmake --version \
# && rm -rf /var/lib/apt/lists/* \
# && apt-get clean 

# TensorRT 8
RUN apt-get update && apt-get install -y \
       libnvinfer8 \
       libnvonnxparsers8 \
       libnvparsers8 \
       libnvinfer-plugin8 \
       libnvinfer-bin \
       python3-libnvinfer \       
&& rm -rf /var/lib/apt/lists/* \
&& apt-get clean

# Pytorch
# RUN python3 -m pip install -U --extra-index-url https://download.pytorch.org/whl/cu113 \
#         torch \
#         torchvision \
#         torchaudio

# Install VPI packages
ARG HAS_GPU="true"
RUN if [ "$HAS_GPU" = "true" ]; then \
	set -e ; \
        apt-key adv --fetch-key https://repo.download.nvidia.com/jetson/jetson-ota-public.asc ; \
        add-apt-repository 'deb http://repo.download.nvidia.com/jetson/x86_64/focal r35.1 main' ; \
        apt-get update ; \
        apt-get install libnvvpi2 vpi2-dev ; \
        rm -rf /var/lib/apt/lists/* ; \
    fi

# Install Tao converter
RUN mkdir -p /opt/nvidia/tao && \
    cd /opt/nvidia/tao && \
    wget https://developer.nvidia.com/tao-converter-80 && \
    unzip tao-converter-80 && \
    chmod 755 $(find /opt/nvidia/tao -name "tao-converter") && \
    ln -sf $(find /opt/nvidia/tao -name "tao-converter") /opt/nvidia/tao/tao-converter && \
    rm tao-converter-80

ENV PATH="${PATH}:/opt/nvidia/tao"

# Update environment
#ENV LD_LIBRARY_PATH="${LD_LIBRARY_PATH}:/opt/tritonserver/lib"

# Add MQTT binaries and libraries
RUN apt-add-repository ppa:mosquitto-dev/mosquitto-ppa \
    && apt-get update \
    && apt-get install -y mosquitto mosquitto-clients \
&& rm -rf /var/lib/apt/lists/* \
&& apt-get clean

RUN python3 -m pip install -U \
        paho-mqtt

# Upgrade libc to resolve vulnerabilities including CVE-2019-11477
RUN apt-get update && apt-get install -y --only-upgrade \
       linux-libc-dev \      
&& rm -rf /var/lib/apt/lists/* \
&& apt-get clean

# Downgrade protobuf
RUN python3 -m pip install \
        protobuf==3.20.1


# User setting --------------------------
# Setup non-root admin user
ARG USERNAME=admin
ARG USER_UID=1000
ARG USER_GID=1000

# Install prerequisites
RUN apt-get update && apt-get install -y \
        sudo \
&& rm -rf /var/lib/apt/lists/* \
&& apt-get clean

# Reuse triton-server user as 'admin' user if exists
# RUN if [ $(getent group triton-server) ]; then \
#         groupmod --gid ${USER_GID} -n ${USERNAME} triton-server ; \
#         usermod -l ${USERNAME} -u ${USER_UID} -m -d /home/${USERNAME} triton-server ; \
#         mkdir -p /home/${USERNAME} ; \
#         sudo chown ${USERNAME}:${USERNAME} /home/${USERNAME} ; \
#     fi

# Create the 'admin' user if not already exists
RUN if [ ! $(getent passwd ${USERNAME}) ]; then \
        groupadd --gid ${USER_GID} ${USERNAME} ; \
        useradd --uid ${USER_UID} --gid ${USER_GID} -m ${USERNAME} ; \
    fi

# Update 'admin' user
RUN echo ${USERNAME} ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/${USERNAME} \
    && chmod 0440 /etc/sudoers.d/${USERNAME} \
    && adduser ${USERNAME} video && adduser ${USERNAME} sudo

ENV USERNAME=${USERNAME}
ENV USER_GID=${USER_GID}
ENV USER_UID=${USER_UID}

# Install linux packages
RUN apt update && apt install --no-install-recommends -y nano usbutils gdb zip htop screen libgl1-mesa-glx net-tools
#RUN apt-get update && apt-get -y install nano usbutils gdb

#install pytorch for cuda11.7
RUN python -m pip install --upgrade pip wheel
RUN pip3 install torch torchvision torchaudio
RUN pip3 install --no-cache jupyterlab ultralytics albumentations comet gsutil notebook 'opencv-python<4.6.0.66'
RUN pip3 --default-timeout=2000 install tensorflow==2.11.*
RUN pip3 install sklearn matplotlib pandas numpy Pillow scipy seaborn pynvml
# Downloads to user config dir
ADD https://ultralytics.com/assets/Arial.ttf https://ultralytics.com/assets/Arial.Unicode.ttf /root/.config/Ultralytics/

# Install pip packages
#COPY ./requirements.txt .
#RUN pip3 install -r requirements.txt

RUN echo "export LD_LIBRARY_PATH=$HOME/opt/lib:$LD_LIBRARY_PATH" >> $HOME/.bashrc

# Copy scripts
#RUN mkdir -p /usr/local/bin/scripts
#COPY ./*entrypoint.sh /usr/local/bin/scripts/
#RUN  chmod +x /usr/local/bin/scripts/*.sh
#ENTRYPOINT ["/usr/local/bin/scripts/ubuntu22_entrypoint.sh"]
CMD ["bash"]