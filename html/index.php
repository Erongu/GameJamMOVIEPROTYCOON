<!doctype html>
<html lang="{{ app()->getLocale() }}">
<head>
    <title>Alpa \o/ -</title>

    <script src="//code.jquery.com/jquery-3.2.1.min.js"></script>
    <script src="/js/jquery/jquery-ui.js"></script>
    <script src="//code.jquery.com/jquery-migrate-git.min.js"></script>
    
    <script src="//rawgit.com/alexanderdickson/waitForImages/2.2.0/dist/jquery.waitforimages.min.js"></script>
    <script src="//rawgit.com/jpillora/notifyjs/v0.4.2/dist/notify.js"></script>
    <script src="//rawgit.com/rochal/jQuery-slimScroll/v1.3.8/jquery.slimscroll.min.js"></script>
    <script src="//rawgit.com/jquery/jquery-mousewheel/3.1.13/jquery.mousewheel.min.js"></script>
    
    
    <script src="js/vendor.js"></script>
    <script src="js/trim-canvas.js"></script>
    
    <script src="js/Main.js"></script>

    <script src="js/socket/socket.js"></script>
    <script src="js/socket/CurrentUser.js"></script>
    <script src="js/interfaces/Interface.js"></script>

    
    <link rel="stylesheet" href="//code.jquery.com/ui/1.12.1/themes/ui-darkness/jquery-ui.css" />
    <link rel="stylesheet" type="text/css" href="css/awesome.css">
    <link rel="stylesheet" type="text/css" href="css/alpa.css">
    <link rel="stylesheet" type="text/css" href="css/font-awesome.min.css">
    <link rel="stylesheet" href="css/fonts.css" />
    <link rel="stylesheet" type="text/css" href="css/footer.css">
    <link rel="stylesheet" type="text/css" href="css/animate.css">


</head>
 <body>
    <section id="infos">
        <!--p id="cellId">CellId: 0</p>-->
    </section>
    
    <section id="logs_interface" class="interface needResize fadeInRight animated">
        <header class="bloc itf-head oh">
            <i class="fa fa-cube"></i> Logs
            <div class="itf-btn itf-reduce"><i class="fa fa-minus"></i><i class="fa fa-plus"></i></div>
        </header>
        <content class="bloc h p6 itf-content needScroll">
            <div class="bloc p6 log" style="top: 5px" id="logs">
            </div>
        </content>
    </section>
    
    
    <section id="login_popup" class="interface closable middle">
        <header class="bloc itf-head oh">
            <i class="fa fa-cube"></i> Connexion
        </header>
            <content class="bloc p6 itf-text">
            <div class="popup_content">
                <div id="LogInDialog" class="Active">
                <h3>Sélectionner un service pour vous connecter</h3>
                <ul id="LogInOptions">
                <li>
                <a href="/auth/steam"><img src="/images/loginIcons/steam.png" alt="Steam" title="Connexion avec Steam"></a>
                </li>
                <li>
                <a href="/auth/twitch"><img src="/images/loginIcons/twitch.png" alt="Twitch" title="Connexion avec Twitch"></a>
                </li>
                <li>
                <a href="/auth/twitter"><img src="/images/loginIcons/twitter.png" alt="Twitter" title="Connexion avec Twitter"></a>
                </li>
                <li>
                <a href="/auth/facebook"><img src="/images/loginIcons/facebook.png" alt="Facebook" title="Connexion avec Facebook"></a>
                </li>
                <li>
                <a href="/auth/google"><img src="/images/loginIcons/google.png" alt="Google+" title="Connexion avec Google+"></a>
                </li>
                </ul>
                <input type="submit" value="Jouer en tant qu'invité" id="connect_login" class="bloc submit"></input>
                </div>
            </div>
        </content>
    </section>
    
    <section id="servers_popup" class="interface middle">
        <header class="bloc itf-head oh">
            <i class="fa fa-cube"></i> Choix du Jeu
        </header>
            <content class="bloc p6 itf-text">
            <div class="popup_content" id="games_available">
                <ul>
                </ul>
            </div>
        </content>
    </section>

    <section id="song_popup" class="interface left bottom">
        <header class="bloc itf-head oh">
            <i class="fa fa-cube"></i> Musique
        </header>
            <content class="bloc p6 itf-text">
            <div class="popup_content" id="songs">
                <iframe src="https://open.spotify.com/embed/user/21kkw67vms6rceggcpk6a4hai/playlist/2YwAhPCvxW8iWlNmPnyPf6" width="250" height="80" frameborder="0" allowtransparency="true"></iframe>
            </div>
        </content>
    </section>

    <?php
        include("includes/footer.php");
    ?>
</body>
</html>
<script type="text/javascript">
    Load();
</script>