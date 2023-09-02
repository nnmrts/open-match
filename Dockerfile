FROM debian:buster-slim

ENV DENO_VERSION=1.36.4
ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get -qq update \
	&& apt-get -qq install -y --no-install-recommends \
	curl \
	ca-certificates \
	unzip \
	ca-certificates \
	fonts-liberation \
	libappindicator3-1 \
	libasound2 \
	libatk-bridge2.0-0 \
	libatk1.0-0 \
	libc6 \
	libcairo2 \
	libcups2 \
	libdbus-1-3 \
	libexpat1 \
	libfontconfig1 \
	libgbm1 \
	libgcc1 \
	libgles2-mesa-dev \
	libglfw3-dev \
	libglib2.0-0 \
	libgtk-3-0 \
	libnspr4 \
	libnss3 \
	libpango-1.0-0 \
	libpangocairo-1.0-0 \
	libstdc++6 \
	libx11-6 \
	libx11-xcb1 \
	libxcb1 \
	libxcomposite1 \
	libxcursor1 \
	libxdamage1 \
	libxext6 \
	libxfixes3 \
	libxi6 \
	libxrandr2 \
	libxrender1 \
	libxss1 \
	libxtst6 \
	lsb-release \
	wget \
	xdg-utils \
	libdrm2 \
	libxkbcommon0 \
	libxshmfence1 \
	&& curl -fsSL https://github.com/denoland/deno/releases/download/v${DENO_VERSION}/deno-x86_64-unknown-linux-gnu.zip \
	--output deno.zip \
	&& unzip deno.zip \
	&& rm deno.zip \
	&& chmod 755 deno \
	&& mv deno /usr/bin/deno \
	&& apt-get -qq remove --purge -y \
	curl \
	unzip \
	&& apt-get -y -qq autoremove \
	&& apt-get -qq clean \
	&& rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

# RUN useradd --uid 1993 --user-group deno \
# 	&& mkdir /root/.cache/ \
# 	&& chown deno:deno /root/.cache/

# ENV DENO_DIR /root/deno-dir/

WORKDIR /root
COPY . .

RUN deno task build

EXPOSE 8000

ENTRYPOINT ["deno"]

CMD ["task", "preview"]