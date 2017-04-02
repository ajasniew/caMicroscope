ToolBar.prototype.algorithmSelector = function () {
  var self = this
  var ftree
  xxx = []
}


//var available_colors = ['lime', 'red', 'blue', 'orange','lime', 'red', 'blue', 'orange','lime', 'red', 'blue', 'orange']
var available_colors = ['#a6cee3','#1f78b4','#b2df8a','#33a02c','#fb9a99','#e31a1c','#fdbf6f','#ff7f00','#cab2d6','#6a3d9a','#ffff99','#b15928'];
var algorithm_color = {}

function goodalgo (data, status) {
   console.log("goodalgo data is: "+data);
   console.log("data.length is: "+data.length)
  
  
  var blob = []
  for (i = 0;i < data.length;i++) {
    var n = {}
    //console.log(data[i])
    data[i].title=data[i].provenance.analysis_execution_id;
    
    n.title = "<div class='colorBox' style='background:" + available_colors[i] + "'></div>" + data[i].title;
    n.key = i.toString()
    n.refKey = data[i].provenance.analysis_execution_id
    n.color = available_colors[i%7];
    //algorithm_color[data[i].provenance.analysis_execution_id] = available_colors[i%7]
    algorithm_color[data[i].provenance.analysis_execution_id] = available_colors[i%available_colors.length];
    blob.push(n)
  }
  
  console.log("blob is: "+blob);
  
  ftree = jQuery('#tree').fancytree({
    source: [{
      title: 'Algorithms', key: '1', folder: true,
      children: blob,
      expanded: true
    }],
    minExpandLevel: 1, // 1: root node is not collapsible
    activeVisible: true, // Make sure, active nodes are visible (expanded).
    aria: false, // Enable WAI-ARIA support.
    autoActivate: true, // Automatically activate a node when it is focused (using keys).
    autoCollapse: false, // Automatically collapse all siblings, when a node is expanded.
    autoScroll: false, // Automatically scroll nodes into visible area.
    clickFolderMode: 4, // 1:activate, 2:expand, 3:activate and expand, 4:activate (dblclick expands)
    checkbox: true, // Show checkboxes.
    debugLevel: 2, // 0:quiet, 1:normal, 2:debug
    disabled: false, // Disable control
    focusOnSelect: false, // Set focus when node is checked by a mouse click
    generateIds: false, // Generate id attributes like <span id='fancytree-id-KEY'>
    idPrefix: 'ft_', // Used to generate node id´s like <span id='fancytree-id-<key>'>.
    icons: true, // Display node icons.
    keyboard: true, // Support keyboard navigation.
    keyPathSeparator: '/', // Used by node.getKeyPath() and tree.loadKeyPath().
    minExpandLevel: 1, // 1: root node is not collapsible
    quicksearch: false, // Navigate to next node by typing the first letters.
    selectMode: 2, // 1:single, 2:multi, 3:multi-hier
    tabbable: true, // Whole tree behaves as one single control
    titlesTabbable: false, // Node titles can receive keyboard focus
    beforeSelect: function (event, data) {
      // A node is about to be selected: prevent this for folders:
      if (data.node.isFolder()) {
        return false
      }
    },
    select: function (event, data) {
      jQuery('#tree').attr('algotree', true)
      var node = data.node

      console.log('!SELECTED NODE : ' + node.title)
      targetType = data.targetType
      annotool.getMultiAnnot()
    }
  })
}
