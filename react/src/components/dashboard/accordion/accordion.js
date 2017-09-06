import React from 'react';
import AnimateMixin from 'react-animate';
/**
 * Accordion object that maintains a list of content containers and their collapsed or expanded state
 * @type {*|Function}
 */
class Accordion extends React.Component {
    /**
     * Mixin the AnimateMixin
     */
    mixins: [AnimateMixin],
    /**
     * Get the initial state
     * @returns {{itemMap: {}}}
     */
    getInitialState: function() {
        //map item indexes and their initial states
        var itemMap = this.props.items.map(function( i, idx ) {
            return {
                animating: false,
                open: idx === 0,
                content:i.content,
                header:i.header
            };
        });

        return {
            itemMap: itemMap
        }

    },
    /**
     * Event handler for clicking on an accordion header
     * @param idx
     * @param event
     */
    toggle: function( idx, event ) {
        var _this = this, currentHeight = this.getParentHeight(event),
            scrollHeight = this.getParentScrollHeight(event), newHeight,
            itemMap = this.state.itemMap;

        //toggle animation for this item
        itemMap[idx].animating = true;
        this.setState({itemMap: itemMap});

        //choose the right the new height
        newHeight = currentHeight >= 25 ? "25px" : scrollHeight + "px";

        //send off to the animation library
        this.animate(
            idx + "toggle",
            {height: currentHeight + "px"},
            {height: newHeight},
            250,
            {
                //when it's done, toggle animating bool
                onComplete: function() {
                    var newMap = _this.state.itemMap;
                    newMap[idx].animating = false;
                    newMap[idx].open = newHeight !== "25px";
                    _this.setState({itemMap: newMap});
                }
            }
        );

    },
    /**
     * Get the clientHeight of the parent element from a triggered event
     * @param event
     * @returns {number}
     */
    getParentHeight: function( event ) {
        return event.target.parentNode.clientHeight;
    },
    /**
     * Get the scrollHeight of the parent element from a trigger event
     * @param event
     * @returns {number}
     */
    getParentScrollHeight: function( event ) {
        return event.target.parentNode.scrollHeight;
    },
    /**
     * Define our default header style
     * @returns {{height: string, backgroundColor: string, cursor: string}}
     */
    getItemHeaderStyle: function() {
        return {
            height: "25px",
            backgroundColor: "#f9f9f9",
            cursor: "pointer"
        };
    },
    /**
     *The default style for each accordion item
     */
    getDefaultItemStyle: function() {
        return {
            borderRadius: "3px",
            marginBottom: "5px",
            overflow: "hidden",
            border: "1px solid #cecece"
        }
    },
    /**
     * Render
     * @returns {XML}
     */
    render: function() {
        var _this = this;
        var items = this.props.items;

        //add the content to the accordion container
        var contents = items.map(function( i, idx ) {

            //calculate the current style
            var itemStyle = _this.getDefaultItemStyle();
            if ( _this.state.itemMap[idx].animating ) {
                itemStyle.height = _this.getAnimatedStyle(idx + "toggle").height;
            } else {
                itemStyle.height = _this.state.itemMap[idx].open ? "auto" : "25px"
            }

            return <div style={itemStyle} className={_this.props.itemClassName} key={idx}>
                <div style={_this.getItemHeaderStyle()} onClick={_this.toggle.bind(_this, idx)}>
                     {i.header}
                </div>
                    {i.content}
            </div>
        });

        return (
            <div className={this.props.className}>
                {contents}
            </div>
        );
    }
});

export default Accordion;