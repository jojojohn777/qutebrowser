# Enable content blocking
c.content.blocking.enabled = True
c.content.blocking.method = "both"  # Uses both hosts blocking and ABP-style blocking

# Enable the adblock list
c.content.blocking.adblock.lists = [
    "https://easylist.to/easylist/easylist.txt",
    "https://easylist.to/easylist/easyprivacy.txt",
    "https://secure.fanboy.co.nz/fanboy-cookiemonster.txt",
        'https://raw.githubusercontent.com/StevenBlack/hosts/master/hosts',
    'https://raw.githubusercontent.com/blocklistproject/Lists/master/youtube.txt'
]
# c.content.javascript.clipboard =
c.content.javascript.enabled = True
c.content.javascript.can_open_tabs_automatically = False

config.bind('I', 'jseval -q expose_qutebrowser_api(self)')
# Load existing settings made via :set in qutebrowser
config.load_autoconfig()

# Set to autosave sessions
config.set('auto_save.session', True)

# Set to restore tabs from the last session
config.set('session.lazy_restore', True)
# config.set('url.start_pages', ['bookmarks://'])
# Set default page when the last tab is closed
# config.set("tabs.last_close", "default-page")


# Disable loading of autoconfig.yml
config.load_autoconfig(False)

# Set the start page
# c.url.start_pages = 'https://www.google.com'

# Set the default search engine
c.url.searchengines = {'DEFAULT': 'https://duckduckgo.com/?q={}'}

# Enable dark mode
c.colors.webpage.darkmode.enabled = True

# Set key bindings
# config.bind('l', 'scroll down')
# config.bind('o', 'scroll up')
# config.unbind('<Ctrl-a>')
config.bind('J','scroll page-up')
config.bind('K','scroll page-down')

# ctrl + l should focus on browser url typing input
config.bind('<Ctrl-l>', 'cmd-set-text -s :open ')
config.bind('<Ctrl-Shift-I>', 'devtools bottom')
config.bind('<Ctrl-1>','devtools-focus')
# config.bind('d','open')
config.unbind('d')
config.unbind('<Ctrl-v>')
config.bind('<Ctrl-r>', 'reload')
config.bind('<Alt-left>','back')
config.bind('<Alt-right>','forward')

config.bind('<Alt-s>','tab-next')
config.bind('<Alt-a>','tab-prev')
 
config.bind('<Ctrl-8>','bookmark-list')
config.bind('<Ctrl-b>','bookmark-add')

# config.bind('<Escape>', 'leave-mode')
# config.set('input.insert_mode.auto_load', True)



c.url.default_page = 'about:blank'
# c.url.start_pages = []
c.url.open_base_url = True
config.bind('<Ctrl+t>', 'open -t ;; cmd-set-text :open *')


# config.bind('<Ctrl-/>', 'config-source')
config.bind('<Ctrl-p>', 'process')
# config.bind('<Ctrl-i>', 'spawn ~/.config/qutebrowser/userscripts/my_script.sh')
# config.bind('<Ctrl-h>', 'spawn --userscript ~/.config/qutebrowser/userscripts/my_script.js')
# config.bind('<Ctrl-j>', 'jseval --file /home/jojo/.config/qutebrowser/userscripts/textCopy.js')
# Bind Ctrl+J to execute the JavaScript file and enter insert mode
# Bind Ctrl+J to execute the JavaScript file and enter insert mode
config.bind('<Ctrl-;>', 'jseval --file /home/jojo/.config/qutebrowser/userscripts/textCopy.js')
c.logging.level.console = 'vdebug'
config.bind('<Ctrl-h>', 'jseval --file /home/jojo/.config/qutebrowser/userscripts/my_script.js')

# config.unbind('<Ctrl-m>')
config.unbind('<Ctrl-u>')
# config.bind('<Ctrl-;>')


# Autoload JS file for all websites (or you can specify a URL pattern)
config.set('content.javascript.enabled', True, 'https://*/*')

# Inject the JS script by using a qutebrowser command at startup for certain websites
# config.source('/home/jojo/.config/qutebrowser/userscripts/my_script.js')
config.set('hints.chars', 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+[]{};:\'",.<>?/|\\')

c.hints.selectors["all"] = [
    "a", "area", "textarea", "select", "input:not([type='hidden'])", "button", 
    "frame", "iframe", "img", "link", "summary", 
    "[contenteditable]:not([contenteditable='false'])", "[onclick]", "[onmousedown]", 
    "[role='link']", "[role='option']", "[role='button']", "[role='tab']", 
    "[role='checkbox']", "[role='switch']", "[role='menuitem']", 
    "[role='menuitemcheckbox']", "[role='menuitemradio']", "[role='treeitem']", 
    "[aria-haspopup]", "[ng-click]", "[ngClick]", "[data-ng-click]", "[x-ng-click]", 
    "[tabindex]:not([tabindex='-1'])", "span"
]
# config.bind('<i>', '')
# Enable JavaScript
c.content.javascript.enabled = True

# Allow JavaScript to access clipboard
c.content.javascript.clipboard = "access"
# Allow JavaScript to open windows
c.content.javascript.can_open_tabs_automatically = True

# Enable JavaScript in PDFs
c.content.pdfjs = True

# Allow websites to request geolocation
c.content.geolocation = True

# Enable WebGL
c.content.webgl = True

# Enable WebRTC
c.content.webrtc_ip_handling_policy = 'all-interfaces'

# Enable service workers
c.content.cookies.store = True

# Commented out options remain the same
# c.content.ssl_strict = False
# c.content.headers.user_agent = '...'
# c.content.local_file_access = True