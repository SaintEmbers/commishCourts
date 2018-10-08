import Colors from '../../../native-base-theme/variables/commonColor';

export default {
  navbarProps: {
    navigationBarStyle: { backgroundColor: 'black', height: 30 },
    titleStyle: {
      color: 'white',
      alignSelf: 'center',
      letterSpacing: 2,
      fontSize: Colors.fontSizeBase,
      marginTop: -30,

    },
    backButtonTintColor: Colors.textColor,
  },

  tabProps: {
    swipeEnabled: false,
    activeBackgroundColor: 'rgba(255,0,0,0.1)',
    inactiveBackgroundColor: Colors.brandPrimary,
    tabBarStyle: { backgroundColor:'rgba(255,0,0,1)' },
  },

  icons: {
    style: { color: 'white' },
  },
};
