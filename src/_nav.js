export const customer = {
  items: [
    {
      name: 'My Account',
      url: '/account',
      icon: 'fa fa-user'
    },
    {
      name: 'Order',
      url: '/order',
      icon: 'fa fa-cart-plus'
    },
    {
      name: 'Community',
      url: '/community',
      icon: 'fa fa-globe'
    },
    {
      name: 'History',
      url: '/history',
      icon: 'fa fa-history'
    },
    {
      name: 'Support',
      url: '/support',
      icon: 'fa fa-question-circle'
    },
    {
      name: 'About',
      url: '/about',
      icon: 'fa fa-info-circle'
    }
  ]
};

export const agent = {
  items: [
    {
      name: 'My Account',
      url: '/account',
      icon: 'fa fa-user'
    },
    {
      name: 'Pickups',
      url: '/pickups',
      icon: 'fa fa-truck',
      children: [
        {
          name: 'New',
          url: '/pickups/new',
          icon: 'fa fa-plus-circle'
        },
        {
          name: 'Pending',
          url: '/pickups/pending',
          icon: 'fa fa-pause-circle-o'
        }
      ]
    },
    {
      name: 'History',
      url: '/history',
      icon: 'fa fa-history'
    },
    {
      name: 'Support',
      url: '/support',
      icon: 'fa fa-question-circle'
    }
  ]
};

export const admin = {
  items: [
    {
      name: 'My Account',
      url: '/account',
      icon: 'fa fa-user'
    },
    {
      name: 'Agents',
      url: '/agent',
      icon: 'fa fa-users'
    },
    {
      name: 'Communty',
      url: '/communty',
      icon: 'fa fa-globe',
      children: [
        {
          name: 'Add',
          url: '/community/edit',
          icon: 'fa fa-plus-circle'
        },
        {
          name: 'Review',
          url: '/community',
          icon: 'fa fa-eye'
        }
      ]
    },
    {
      name: 'Customer',
      url: '/customer',
      icon: 'fa fa-male'
    }
  ]
};