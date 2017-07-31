/*
 * 
 */
(function ($) {

  let target = document.getElementById('dashboard'),
      opts = {
        lines: 9, 
        length: 9,
        width: 3, 
        radius: 14, 
        color: '#247BA0',
        speed: 1.9,  
        trail: 40,  
        className: 'spinner',  
      }, 
      spinner = new Spinner(opts).spin(target),
      apiURL = 'https://1kfs7evxca.execute-api.eu-west-1.amazonaws.com/beta/grants',
      grantsIssue,
      freqData = [],
      grantsTotal = 0,
      ukTotal = 0;


  $.getJSON( apiURL, function( data ) {

    grantsIssue = data.data['facets'].issue
    grantsProjects = data.data['pagination'].total
    ukTotal = parseInt(data.data['facets'].country_name[0].total_awarded)

    // Calulate overall awarded
    for (var i = 0; i < grantsIssue.length; i++) {
      grantsTotal += parseInt(grantsIssue[i].total_awarded) << 0;
    } 

    $('.grant_total').append('&pound;' + parseInt(grantsTotal/1000000))
    $('.grant_projects').append( grantsProjects);
    $('.grant_issues').append( grantsIssue.length);

  });

 // TODO: open issue on github for api to provide list, 
 //currently there isn't way to get list id dynamically
  var issueIDs = ['131', '219', '207', '218', '220', 
                  '222', '108', '96', '269', '266',
                  '210', '101', '212', '268', '65',
                  '203', '217', '265', '271', '169',
                  '270', '8', '109', '267', '214']

  for (let i = 0; i < issueIDs.length; i++) {
      $.getJSON( apiURL + '?fields=issue_id&search=' + issueIDs[i], function () {
      })
      .done(function(myData) {

        dashboardData(
          i,
          myData.data['facets'].issue[0].key, 
          myData.data['facets'].country_name[0].count,
          myData.data['pagination'].total - myData.data['facets'].country_name[0].count,
          myData.data['pagination'].total
        ); 
      });
  } 

function dashboardData(order, name, uk, inl, total) {
  freqData.push(
    { Issue: name,
      freq: { 
        low: uk, 
        mid: inl 
      },
      total: total,
      name: order
    }
  );

  // Temporary of dealing with aysnc issue
  if ( freqData.length == issueIDs.length) {
    // remove spinner
    spinner.stop();
    // call d3js
    dashboard('#dashboard',freqData);
  }
}  

})(jQuery)