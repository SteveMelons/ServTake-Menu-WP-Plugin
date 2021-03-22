<?php

/**
 * @link              https://techslide.de/
 * @since             1.0.0
 * @package           Servtake_Menu
 *
 * @wordpress-plugin
 * Plugin Name:       Servtake Menu
 * Plugin URI:        https://techslide.de/
 * Description:       Servtake Menu is an online menu system to allow the customer to order using WhatsApp. Powered by ServTake.
 * Version:           1.3.5
 * Author:            Oliver Fabian Fischer
 * Author URI:        https://techslide.de/
 * Text Domain:       servtake-menu
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if (!defined('WPINC')) {
  die;
}

/**
 * Currently plugin version.
 */
define('SERVTAKE_MENU_VERSION', '1.3.5');

/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-servtake-menu-activator.php
 */
function activate_servtake_menu()
{
  require_once plugin_dir_path(__FILE__) . 'includes/class-servtake-menu-activator.php';
  Servtake_Menu_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-servtake-menu-deactivator.php
 */
function deactivate_servtake_menu()
{
  require_once plugin_dir_path(__FILE__) . 'includes/class-servtake-menu-deactivator.php';
  Servtake_Menu_Deactivator::deactivate();
}

register_activation_hook(__FILE__, 'activate_servtake_menu');
register_deactivation_hook(__FILE__, 'deactivate_servtake_menu');

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path(__FILE__) . 'includes/class-servtake-menu.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_servtake_menu()
{

  $plugin = new Servtake_Menu();
  $plugin->run();

  // -------- plugin-update-checker
  require 'plugin-update-checker/plugin-update-checker.php';
  $myUpdateChecker = Puc_v4_Factory::buildUpdateChecker(
    'https://github.com/SteveMelons/servtake_menu_wp_plugin/',
    __FILE__,
    'servtake-menu'
  );

  //Optional: Set the branch that contains the stable release.
  // $myUpdateChecker->setBranch('stable-branch-name');
}
run_servtake_menu();
