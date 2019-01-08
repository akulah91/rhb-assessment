
import {Pagination,Icon,Select, Button, Label, Input, Grid, Header, Image, Message, Segment, Divider, Transition, Item } from 'semantic-ui-react';
import React, { Component } from 'react';
import logo from '../assets/images/GitHub-Mark.png';
import { doSearch } from '../api/github';
import moment from 'moment';
import LoadingWrapper from './LoadingWrapper';

const pageoption=[
    { key: 5, text: 5, value: 5 },
    { key: 10, text: 10, value: 10 },
    { key: 20, text: 20, value: 20 },
    { key: 50, text: 50, value: 50 }
  ]

export default class GitHubSearch extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isloaded: false,
            noPerPage: 10,
            activePage: 1,
            activeKey:"",
            typing: false,
            typingTimeout: 0,
            search: "",
            data: {},
            isSearching:false,
        }
    }
    componentDidMount() {
        this.setState({ isloaded: true });
    }

    render() {
        const { isloaded, search, data,isSearching, noPerPage, activePage } = this.state;
        const totaldata=(data.total_count>1000?1000:data.total_count);
        let totalpage=Math.ceil(totaldata/noPerPage);
        
        return (
            <Transition visible={isloaded} animation='horizontal flip' duration={500}>
                <div className=''>
                    <Grid textAlign='center' style={{ height: '100%' }} verticalAlign='middle'>
                        <Grid.Column className="searchBox">

                            <Header className="searchHeader" as='h3'>

                                <Image className="image" centered src={logo} />
                                <Header.Content>
                                    GitHub Search
                                <Header.Subheader>Search GitHub repository here...</Header.Subheader>
                                </Header.Content>
                            </Header>
                            <Segment>
                                <Input labelPosition='right' fluid name="search"  value={search} placeholder='Search...' 
                                onChange={this.handleInputChange} onKeyPress={this.handleKeyPress} action >
                                 <input />
                                 <Label basic>
                                 <Icon name='search' />
                                 </Label>
                                 <Label>Show :</Label>
                                 <Select onChange={this.ddlchange} compact options={pageoption} value={noPerPage} />
                                </Input>


                                <LoadingWrapper isloading={isSearching} title="Searching...." >
                                    {(data.items ? (
                                        <React.Fragment>
                                            <Divider horizontal>Results : {data.total_count}</Divider>
                                            {data.total_count<1 && <Header as='h5'>Not found any repository matched your search..</Header>}
                                            <this.renderSearchResults />
                                        </React.Fragment>
                                    ) :
                                        (<Header as='h5'>Please search repository here...</Header>
                                        ))}

                                </LoadingWrapper>
                            </Segment>
                            {data.total_count &&
                                <Pagination color="red" 
                                activePage={activePage}
                                    ellipsisItem={{ content: <Icon name='ellipsis horizontal' />, icon: true }}
                                    firstItem={{ content: <Icon name='angle double left' />, icon: true }}
                                    lastItem={{ content: <Icon name='angle double right' />, icon: true }}
                                    prevItem={{ content: <Icon name='angle left' />, icon: true }}
                                    nextItem={{ content: <Icon name='angle right' />, icon: true }}
                                    totalPages={totalpage}
                                    onPageChange={this.handlePaginationChange}
                                />
                                }
                        </Grid.Column>
                    </Grid>
                </div>
            </Transition>
        );
    }


    handlePaginationChange = async (e, { activePage }) => {
        
        const { noPerPage,activeKey } = this.state;
        this.setState({ isSearching: true })
        doSearch(activeKey, noPerPage, activePage).then(data=>{
        this.setState({ data,activePage })
        this.delaySetState({isSearching: false},700);
        }).catch(e=>{
            console.log(e)
        })

        this.setState({ activePage })
    }
    handleInputChange = (event) => {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
        });
        const self = this;

        if (self.state.typingTimeout) {
            clearTimeout(self.state.typingTimeout);
        }

        self.setState({
            [name]: value,
            typing: true,
            typingTimeout: setTimeout(async () => {
                const { noPerPage } = self.state;
                if (value.length) {

                    self.setState({ isSearching: true })
                     doSearch(value, noPerPage, 1).then(data=>{

                        self.setState({ data,activeKey:value ,activePage:1})
                    self.delaySetState({isSearching: false},700);
                    }).catch(e=>{
                        console.log(e)
                    })
                }
            }, 700)
        });
    }
    ddlchange=(e,data)=>{
        const {activeKey } = this.state;
        let noPerPage= data.value;
        this.setState({noPerPage});
        
       // alert(noPerPage)
        if (activeKey.length) {
            this.setState({ isSearching: true })
             doSearch(activeKey, noPerPage, 1).then(data=>{
                this.setState({ data ,activePage:1})
                this.delaySetState({isSearching: false},700);
            }).catch(e=>{
                console.log(e)
            })
        }
    }
    handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            const target = e.target;
            const value = target.type === 'checkbox' ? target.checked : target.value;

            
            const { noPerPage } = this.state;
            if (value.length) {
                this.setState({ isSearching: true })
                 doSearch(value, noPerPage, 1).then(data=>{
                    this.setState({ data,activeKey:value ,activePage:1})
                    this.delaySetState({isSearching: false},700);
                }).catch(e=>{
                    console.log(e)
                })
            }
        }
      }

      delaySetState=(state,delay)=>{
          const self=this;
          setTimeout(async () => {
            self.setState(state);
          }, delay)
      }
    renderSearchResults = (props) => {
        const { data } = this.state;
        return (
            <Item.Group className="searchResults" divided>
                {data.items.map((item,index) => (
                    <Item key={index}>
                        <Item.Image className="searchImg" src={item.owner.avatar_url} />

                        <Item.Content as={Grid} columns={3} divided>
                            <Grid.Row>
                                <Grid.Column width={10}>
                                    <Item.Header as='a' href={item.html_url} target="_blank">{item.full_name}</Item.Header>
                                    <Item.Description>{item.description}</Item.Description>
                                    <Item.Meta >
                                        <span className='cinema'>{this.getFbtime(moment(item.updated_at))}</span>
                                    </Item.Meta>
                                </Grid.Column>
                                <Grid.Column width={3}>
                                   {item.language && <Label as='a' color='red' tag> {item.language}</Label>}
                                </Grid.Column>
                                <Grid.Column width={3}>
                                   {item.stargazers_count && <a href={`https://github.com/${item.full_name}/stargazers`} target="_blank"><Header as='h5' icon='star' color="yellow" content={item.stargazers_count} /></a>}
                                </Grid.Column>
                            </Grid.Row>

                        </Item.Content>
                    </Item>
                ))}
            </Item.Group>

        )
    }

    getFbtime = (targetDate) => {
        var now = moment();

        var displayValue = '';

        var difference = now.diff(targetDate, 'days');

        if (difference > 3 || difference < -3) {
            displayValue = targetDate.format('MM-DD-YYYY') + ' at ' + targetDate.format('hh:mm');
        } else {
            // otherwise...
            displayValue = targetDate.fromNow();
        }

        return (displayValue);
    }
}
