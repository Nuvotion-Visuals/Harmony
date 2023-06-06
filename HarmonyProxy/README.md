# Nginx Proxy Manager

## First time configuration
1.  Bring up your stack

```
docker-compose up -d
```

2.  Log in to the Admin UI

When your docker container is running, connect to it on port  `81`  for the admin interface. Sometimes this can take a little bit because of the entropy of keys.

[http://127.0.0.1:81](http://127.0.0.1:81/)

Default Admin User:

```
Email:    admin@example.com
Password: changeme

```
3. Change the default login

Immediately after logging in with this default user you will be asked to modify your details and change your password.

## Nginx Proxy Manager Features

### Get Connected

Expose web services on your network · Free SSL with Let's Encrypt · Designed with security in mind · Perfect for home networks

### Proxy Hosts

Expose your private network Web services and get connected anywhere.

### Beautiful UI

Based on Tabler, the interface is a pleasure to use. Configuring a server has never been so fun.

### Free SSL

Built in Let’s Encrypt support allows you to secure your Web services at no cost to you. The certificates even renew themselves!

### Docker FTW

Built as a Docker Image, Nginx Proxy Manager only requires a database.

### Multiple Users

Configure other users to either view or manage their own hosts. Full access permissions are available.

## Guide: How to Add a Wildcard Certificate in Nginx Proxy Manager using Cloudflare.

Posted by u/Sunsparc

This guide assumes that you are currently using Cloudflare for DNS and Nginx Proxy Manager as your reverse proxy. As you can see in the first screenshot, I have several subdomains set up already but decided to issue a wildcard cert for all subdomains.

Log into Nginx Proxy Manager, click SSL Certificates, then click Add SSL Certificate - LetsEncrypt.

The Add dialog will pop up and information needs to be input. For Domain Names, put *.myserver.com, then click Add *.myserver.com in the drop down that appears. Toggle ON Use a DNS Challenge and I Agree to Let's Encrypt Terms of Service. When toggling DNS Challenge, a new section will appear asking for Cloudflare API Token.

Log into Cloudflare and click your domain name. Scroll down and on the right hand side of the page, locate the API section then click Get Your API Token. On the next page, click the API Tokens header. Click Create Token on the next page.

At the bottom of the page, click Get Started under the Custom Token header. On the next page, give the token a name (I called mine NPM for Nginx Proxy Manager). Under Permissions, select Zone in the left hand box, DNS in the center box, and Edit in the right hand box. At the bottom of the page, click Continue to Summary. On the next page, click Create Token.

Once the token is created, it will take you to a page with the newly created token listed so that you can copy it. Click the Copy button or highlight the token and copy it.

Back on the Nginx Proxy Manager page, highlight the sample token in the Credentials File Content box and paste your newly created token. Leave the Propagation Seconds box blank. Click Save.

The box will change to Processing.... with a spinning icon. It may take a minute or two. Once it is finished, it will go back to the regular SSL Certificates page but with your new wildcard certificate added!

Click here to see pictures of the entire process, if you need to follow along with the instructions.

If anyone has questions or if something was not clear, please let me know.
