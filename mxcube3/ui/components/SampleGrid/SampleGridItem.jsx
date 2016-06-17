import React from 'react';
import classNames from 'classnames';
import 'bootstrap-webpack!bootstrap-webpack/bootstrap.config.js';
import './SampleGrid.css';


export const SAMPLE_ITEM_WIDTH = 190;
export const SAMPLE_ITEM_HEIGHT = 130;
export const SAMPLE_ITEM_SPACE = 4;


export class SampleGridItem extends React.Component {

  constructor(props) {
    super(props);
    this.toggleMovable = this.toggleMovable.bind(this);
    this.togglePicked = this.togglePicked.bind(this);
    this.moveItemUp = this.moveItemUp.bind(this);
    this.moveItemDown = this.moveItemDown.bind(this);
    this.moveItemRight = this.moveItemRight.bind(this);
    this.moveItemLeft = this.moveItemLeft.bind(this);
    this.onMouseDown = this.onMouseDown.bind(this);
    this.onMouseEnter = this.onMouseEnter.bind(this);
  }


  onMouseDown(e) {
    if (e.nativeEvent.buttons === 1) {
      this.props.dragStartSelection(this.props.itemKey, this.props.seqId);
    }
  }


  onMouseEnter(e) {
    if (e.nativeEvent.buttons === 1) {
      this.props.dragSelectItem(this.props.itemKey, this.props.seqId);
    }
  }


  toggleMovable(e) {
    e.stopPropagation();
    this.props.toggleMovable(this.props.itemKey);
  }


  togglePicked(e) {
    e.stopPropagation();
    this.props.pickSelected();
  }


  showItemControls() {
    let iconClassName = 'glyphicon glyphicon-unchecked';

    if (this.props.picked) {
      iconClassName = 'glyphicon glyphicon-check';
    }

    const pickButton = (
      <button
        className="samples-grid-item-button"
        bsStyle="default"
        bsSize="s"
        onClick={this.togglePicked}
      >
        <i className={iconClassName} />
      </button>
    );

    const moveButton = (
      <button
        className="samples-grid-item-button"
        onClick={this.toggleMovable}
      >
        <i className="glyphicon glyphicon-move" />
      </button>
     );

    let content = (
      <div className="samples-item-controls-container">
      {pickButton}
      </div>
    );

    if (this.props.selected) {
      content = (
        <div className="samples-item-controls-container">
          {pickButton}
          {moveButton}
        </div>
      );
    }

    return content;
  }


  moveItemUp(e) {
    e.stopPropagation();
    this.props.moveItem('UP');
  }


  moveItemDown(e) {
    e.stopPropagation();
    this.props.moveItem('DOWN');
  }


  moveItemRight(e) {
    e.stopPropagation();
    this.props.moveItem('RIGHT');
  }


  moveItemLeft(e) {
    e.stopPropagation();
    this.props.moveItem('LEFT');
  }


  showMoveArrows() {
    let [displayUp, displayDown, displayLeft, displayRight] = ['', '', '', ''];
    const [up, down, left, right] = this.props.canMove(this.props.itemKey);
    let content = (<div className="seq-id">{this.props.seqId}</div>);

    if (!left) {
      displayLeft = 'none';
    }

    if (!up) {
      displayUp = 'none';
    }

    if (!down) {
      displayDown = 'none';
    }

    if (!right) {
      displayRight = 'none';
    }

    if (this.props.moving) {
      content = (
        <div>
          <div style={{ opacity: 0.7 }} className="seq-id">{this.props.seqId}</div>
          <button
            style={{ display: displayUp }}
            className="move-arrow move-arrow-up"
            onClick={this.moveItemUp}
          >
            <i className="glyphicon glyphicon-arrow-up" />
          </button>
          <button
            style={{ display: displayLeft }}
            className="move-arrow move-arrow-left"
            onClick={this.moveItemLeft}
          >
            <i className="glyphicon glyphicon-arrow-left" />
          </button>
          <button
            style={{ display: displayRight }}
            className="move-arrow move-arrow-right"
            onClick={this.moveItemRight}
          >
            <i className="glyphicon glyphicon-arrow-right" />
          </button>
          <button
            style={{ display: displayDown }}
            className="move-arrow move-arrow-down"
            onClick={this.moveItemDown}
          >
            <i className="glyphicon glyphicon-arrow-down" />
          </button>
        </div>
      );
    }

    return content;
  }


  render() {
    let classes = classNames('samples-grid-item',
      { 'samples-grid-item-selected': this.props.selected && !this.props.moving,
        'samples-grid-item-moving': this.props.moving,
        'samples-grid-item-to-be-collected': this.props.picked });

    let scLocationClasses = classNames('sc_location', 'label', 'label-default',
                                       { 'label-success': this.props.loadable });

    return (
      <div
        className={classes}
        draggable="true"
        onMouseDown={this.onMouseDown}
        onMouseEnter={this.onMouseEnter}
      >
        {this.showMoveArrows()}
        {this.showItemControls()}
        <span className={scLocationClasses}>{this.props.location}</span>
        <br />
        <a href="#" ref="pacronym" className="protein-acronym" data-type="text"
          data-pk="1" data-url="/post" data-title="Enter protein acronym"
        >
          {this.props.name + (this.props.acronym ? ` ( ${this.props.acronym} )` : '')}
        </a>
        <br />
        <span className="dm">{this.props.dm}</span>
        <br />
        <div className="samples-grid-item-tasks">
          {
            this.props.tags.map((tag, i) => {
              const style = { display: 'inline-block', margin: '3px', cursor: 'pointer' };
              let content;

              if ((typeof tag) === 'string') {
                content = <span key={i} className="label label-primary" style={style}>{tag}</span>;
              } else {
                // assuming a Task
                let showForm = (e) => {
                  e.stopPropagation();
                  return this.props.showTaskParametersForm(tag.type, this.props.sampleID, tag);
                };

                let deleteTask = (e) => {
                  e.stopPropagation();
                  return this.props.deleteTask(tag.parent_id, tag.queueID, tag.sampleID);
                };

                content = (
                  <span key={i} className="btn-primary label" style={style} onClick={showForm}>
                    {`${tag.label} `}
                    <i className="fa fa-times" onClick={deleteTask} />
                  </span>
                );
              }

              return content;
            })
          }
        </div>
      </div>
    );
  }
}


SampleGridItem.defaultProps = {
  seqId: '',
  itemKey: '',
  sampleID: '',
  acronym: '',
  name: '',
  dm: '',
  loadable: [],
  location: '',
  tags: '',
  selected: false,
  deleteTask: undefined,
  showTaskParametersForm: undefined,
  toggleMovable: undefined,
  picked: false,
  moving: false,
  moveItem: undefined,
  canMove: undefined,
  pickSelected: undefined,
  dragStartSelection: undefined,
  dragSelectItem: undefined
};
