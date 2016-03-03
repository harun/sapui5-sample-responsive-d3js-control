sap.ui.define([
	"sap/ui/core/Control",
    "sap/ui/core/HTML",
    "sap/ui/core/ResizeHandler",
	"sap/ui/thirdparty/d3"
], function(Control, HTMLControl, ResizeHandler) {
  
  return Control.extend("CustomControl", {
    
    metadata : {
      aggregations : {
        _html : {
          type : "sap.ui.core.HTML",
          multiple : false,
          visibility : "hidden"
        },
        data : {
          type : "sap.ui.base.ManagedObject",
          multiple : true
        }
      }
    },
    
    _iWidth : null,
    _sContainerId : null,
    _sResizeHandlerId : null,
    
    init : function() {
      this._sContainerId = this.getId() + "--container";
      this.setAggregation("_html", new HTMLControl({
        content : "<svg id=\"" + this._sContainerId + "\" width=\"100%\"></svg>"
      }));
    },
    
    _onResize : function(oEvent) {
      this._updateSVG(oEvent.size.width);
    },
    
    _updateSVG : function(iWidth) {
      var aData = this.getBinding("data").getContexts().map(function(oContext) {
        return oContext.getObject();
      });
      
      var selContainer = d3.select("#" + this._sContainerId);
      var selRects = selContainer.selectAll("rect").data(aData);
      
      selRects.enter().append("rect");
      
      var iNumDataPoints = aData.length;
      var iNumSpaces = iNumDataPoints - 1;
      var iSpaceRelativeDoDataPoint = 0.25;
      var iBarWidth = iWidth / (iNumDataPoints + iNumSpaces * iSpaceRelativeDoDataPoint);
      var iSpaceWidth = iBarWidth * iSpaceRelativeDoDataPoint;
      selRects
        .attr("width", iBarWidth)
        .attr("height", function(d) {
          return d.v;
        })
        .attr("x", function(d, i) {
          return i * (iSpaceWidth + iBarWidth);
        });
    },
    
    renderer : function(oRm, oControl) {
      oRm.write("<div");
      oRm.writeControlData(oControl);
      oRm.write(">");
      oRm.write("<h1>Responsive D3.js Custom Control</h1>");
      oRm.write("<p>Change the size of the window and see how the bars adjust</p>");
      oRm.renderControl(oControl.getAggregation("_html"));
      oRm.write("</div>");
    },
    
    onBeforeRendering : function() { ResizeHandler.deregister(this._sResizeHandlerId);
    },
    
    onAfterRendering : function() {
      this._sResizeHandlerId = ResizeHandler.register(this, jQuery.proxy(this._onResize, this));
      
      var $control = this.$();
      if ($control) {
        this._updateSVG($control.rect().width);
      }
    }
  });
  
}, true);
