#!/bin/bash

# Prompt for a URL
read -p "Enter URL to open: " url

# Open the URL in a new tab
qutebrowser ":open -t $url"
