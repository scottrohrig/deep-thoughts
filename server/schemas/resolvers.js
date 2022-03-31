const { AuthenticationError } = require( 'apollo-server-express' );
const { Thought, User, Reaction } = require( '../models' );
const { signToken } = require( '../utils/auth' );

const resolvers = {
  Query: {
    thoughts: async ( parent, { username } ) => {
      const params = username ? { username } : {};
      return Thought.find( params ).sort( { createdAt: -1 } );
    },
    thought: async ( parent, { _id } ) => {
      return Thought.findOne( { _id } );
    },
    // get all users
    users: async () => {
      return User.find()
        .select( '-__v -password' )
        .populate( 'friends' )
        .populate( 'thoughts' );
    },
    // get user by username
    user: async ( parent, { username } ) => {
      return User.findOne( { username } )
        .select( '-__v -password' )
        .populate( 'friends' )
        .populate( 'thoughts' );
    },
    me: async ( parent, args, context ) => {
      if ( context.user ) {
        const userData = await User.findOne( { _id: context.user._id } )
          .select( '-__v -password' )
          .populate( 'thoughts' )
          .populate( 'friends' );

        return userData;
      }
      throw new AuthenticationError( 'Not logged in' );
    }
  },
  Mutation: {
    addUser: async ( parent, args ) => {
      const user = await User.create( args );
      const token = signToken( user );

      return { token, user };
    },
    login: async ( parent, { email, password } ) => {
      const user = await User.findOne( { email } );

      if ( !user ) {
        throw new AuthenticationError( 'Incorrect credentials' );
      }

      const correctPw = await user.isCorrectPassword( password );

      if ( !correctPw ) {
        throw new AuthenticationError( 'Incorrect credentials' );
      }

      const token = signToken( user );
      console.log( 'token:', token );
      return { token, user };
    },
    addThought: async ( parent, args, context ) => {
      // is the user logged in?
      if ( context.user ) {
        const thought = await Thought.create( { ...args, username: context.user.username } );

        await User.findByIdAndUpdate(
          { _id: context.user._id },
          { $push: { thoughts: thought._id } },
          { new: true },
        );
        return thought;
      }
      // otherwise throw an auth error
      throw new AuthenticationError( 'You must be logged in' );
    },
    addFriend: async ( parent, { friendId }, context ) => {
      if ( context.user ) {
        const updatedUser = await User.findOneAndUpdate(
          { _id: context.user._id },
          { $addToSet: { friends: friendId } },
          { new: true },
        );

        return updatedUser;
      }

      throw new AuthenticationError( 'You must be logged in' );
    }
  }



};

module.exports = resolvers;
